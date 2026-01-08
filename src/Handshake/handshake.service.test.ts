import { HandshakeService } from './handshake.service';
import { Handshake } from './handshake.model';
import { CircleService } from '../Circle/circle.service';
import { Types } from 'mongoose';

jest.mock('./handshake.model', () => ({
  Handshake: {
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

jest.mock('mongoose', () => {
  const original = jest.requireActual('mongoose');
  return {
    ...original,
    Types: {
      ...original.Types,
      ObjectId: jest.fn((id) => ({ toString: () => id })),
    },
  };
});

describe('Given a Handshake domain entity', () => {
  let service: HandshakeService;

  const senderId = 'senderIdTest';
  const receiverId = 'receiverIdTest';
  const handshakeId = 'handshakeIdTest';

  const mockCircleService: Partial<CircleService> = {
    getDefaultCircle: jest.fn(),
    addContact: jest.fn(),
  };

  let senderCircle: {
    _id: Types.ObjectId;
    circleContacts: string[];
    save: jest.Mock;
  };
  let receiverCircle: {
    _id: Types.ObjectId;
    circleContacts: string[];
    save: jest.Mock;
  };

  const createMockHandshake = () => ({
    senderId,
    expiresAt: new Date(),
  });

  beforeEach(() => {
    jest.clearAllMocks();
    service = new HandshakeService(mockCircleService as CircleService);

    senderCircle = {
      _id: new Types.ObjectId(senderId),
      circleContacts: [],
      save: jest.fn(),
    };
    receiverCircle = {
      _id: new Types.ObjectId(receiverId),
      circleContacts: [],
      save: jest.fn(),
    };

    (Handshake.findById as jest.Mock).mockResolvedValue({
      senderId: { toString: () => senderId },
      _id: handshakeId,
    });

    (mockCircleService.getDefaultCircle as jest.Mock).mockImplementation(
      (id: string) =>
        id === senderId
          ? Promise.resolve(senderCircle)
          : Promise.resolve(receiverCircle)
    );

    (mockCircleService.addContact as jest.Mock).mockResolvedValue(undefined);
    (Handshake.findByIdAndDelete as jest.Mock).mockResolvedValue(undefined);
  });

  describe('createHandshake', () => {
    it('should create a handshake with senderId and expiresAt', async () => {
      (Handshake.create as jest.Mock).mockImplementation((data) => ({
        ...createMockHandshake(),
        ...data,
      }));

      const result = await service.createHandshake(senderId);

      expect(result.senderId.toString()).toBe(senderId);
      expect(result.expiresAt).toBeInstanceOf(Date);
    });
  });

  describe('acceptHandshake', () => {
    it("should add sender and receiver to each other's default circle and delete handshake", async () => {
      await service.acceptHandshake(handshakeId, receiverId);

      expect(mockCircleService.getDefaultCircle).toHaveBeenCalledWith(senderId);
      expect(mockCircleService.getDefaultCircle).toHaveBeenCalledWith(
        receiverId
      );

      expect(mockCircleService.addContact).toHaveBeenCalledWith(
        senderCircle._id.toString(),
        senderId,
        receiverId
      );
      expect(mockCircleService.addContact).toHaveBeenCalledWith(
        receiverCircle._id.toString(),
        receiverId,
        senderId
      );

      expect(Handshake.findByIdAndDelete).toHaveBeenCalledWith(handshakeId);
    });

    it('should throw if handshake does not exist', async () => {
      (Handshake.findById as jest.Mock).mockResolvedValue(null);
      await expect(
        service.acceptHandshake(handshakeId, receiverId)
      ).rejects.toThrow('Error: Handshake expired or invalid');
    });
  });

  describe('deleteHandshake', () => {
    it('should delete handshake if senderId matches', async () => {
      await service.deleteHandshake(senderId, handshakeId);

      expect(Handshake.findById).toHaveBeenCalledWith(handshakeId);
      expect(Handshake.findByIdAndDelete).toHaveBeenCalledWith(handshakeId);
    });

    it('should throw if senderId does not match', async () => {
      await expect(
        service.deleteHandshake('wrongSenderId', handshakeId)
      ).rejects.toThrow('Error: not the owner of the handshake');
    });

    it('should throw if handshake does not exist', async () => {
      (Handshake.findById as jest.Mock).mockResolvedValue(null);
      await expect(
        service.deleteHandshake(senderId, handshakeId)
      ).rejects.toThrow('Error: Handshake expired or invalid');
    });
  });
});
