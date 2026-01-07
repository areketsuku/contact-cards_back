import { CircleService } from './circle.service';
import { Circle } from './circle.model';

jest.mock('./circle.model', () => ({
  Circle: {
    findById: jest.fn(),
    findByIdAndDelete: jest.fn()
  }
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

describe("Given a Circle domain entity", () => {

  let service: CircleService;

  const circleId = "circleIdTest";
  const ownerId = "circleOwnerTest";
  const contactId = "circleContactTest";

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CircleService();
  })

  const createMockCircle = (/*overrides = {}*/) => ({
    circleOwnerId: {
      toString: () => 'circleOwnerTest',
    },
    circleName: {
      toString: () => 'circleNameTest',
    },
    circleContacts: [
      {
        toString: () => 'circleContactTest',
      },
    ],
    circleAllowedInfo: {
      name: true,
      surname1: false,
      surname2: false,
      email1: false,
      email2: false,
      phone1: false,
      phone2: false,
      country: false,
      adress: false,
      link1: false,
      link2: false,
      avatar: false,
    },
    save: jest.fn().mockResolvedValue(true),
    findByIdAndDelete: jest.fn().mockResolvedValue(true),
  });

  describe("When any method called", () => {
    it("Should return an error if circleId does not coincide", async () => {
      (Circle.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        service.hasContact("unexistentCircleId", ownerId, contactId)
      ).rejects.toThrow("Error: Circle not found");
    });

    it("Should return an error if ownerId does not coincide", async () => {
      (Circle.findById as jest.Mock).mockResolvedValue(createMockCircle());

      await expect(
        service.hasContact(circleId, "notCircleOwnerId", contactId)
      ).rejects.toThrow("Unauthorized: not the owner of the circle");
    });
  });

  describe("When called hasContact", () => {
    it("Should return true if contactId exist in circleContacts", async () => {

      (Circle.findById as jest.Mock).mockResolvedValue(createMockCircle());

      const result = await service.hasContact(circleId, ownerId, contactId);

      expect(Circle.findById).toHaveBeenCalledWith(circleId);
      expect(result).toBe(true);
    });

    it("Should return false if contactId does not exist in circleContacts", async () => {

      (Circle.findById as jest.Mock).mockResolvedValue(createMockCircle());

      const result = await service.hasContact(circleId, ownerId, "notCircleContactTest");

      expect(Circle.findById).toHaveBeenCalledWith(circleId);
      expect(result).toBe(false);

    });
  });

  describe("When called addContact", () => {
    it("should return the Circle if contact already exist", async () => {
      const mockCircle = createMockCircle();
      (Circle.findById as jest.Mock).mockResolvedValue(mockCircle);

      const result = await service.addContact(circleId, ownerId, contactId);

      expect(Circle.findById).toHaveBeenCalledWith(circleId);
      expect(result).toBe(mockCircle);
    });
    it("should add new contact to Circle if it doesn't already exist & return the Circle", async () => {
      const mockCircle = createMockCircle();
      (Circle.findById as jest.Mock).mockResolvedValue(mockCircle);

      const result = await service.addContact(circleId, ownerId, "newCircleContactTest");

      expect(Circle.findById).toHaveBeenCalledWith(circleId);
      expect(result).toBe(mockCircle);
      expect(result.circleContacts.some(c => c.toString() === "newCircleContactTest")).toBe(true);
      expect(mockCircle.save).toHaveBeenCalled();
    });
  });

  describe("When called removeContact", () => {
    it("Should delete contact from circleContacts and return the Circle", async () => {
      const mockCircle = createMockCircle();
      (Circle.findById as jest.Mock).mockResolvedValue(mockCircle);

      const result = await service.removeContact(circleId, ownerId, "circleContactTest");

      expect(Circle.findById).toHaveBeenCalledWith(circleId);
      expect(result).toBe(mockCircle);
      expect(result.circleContacts.some(c => c.toString() === "circleContactTest")).toBe(false);
      expect(mockCircle.save).toHaveBeenCalled();
    });
  });

  describe("When called updateAllowedInfo", () => {
    it("Should update circleAllowedInfo with the new info allowed", async () => {
      const mockCircle = createMockCircle();
      (Circle.findById as jest.Mock).mockResolvedValue(mockCircle);

      const newAllowedInfo = {
        name: true,
        surname1: true,
        surname2: false,
        email1: true,
        email2: false,
        phone1: true,
        phone2: false,
        country: false,
        adress: false,
        link1: true,
        link2: false,
        avatar: true,
      };

      const result = await service.updateAllowedInfo(circleId, ownerId, newAllowedInfo);

      expect(Circle.findById).toHaveBeenCalledWith(circleId);
      expect(result).toBe(mockCircle);
      expect(result.circleAllowedInfo).toMatchObject(newAllowedInfo);
      expect(mockCircle.save).toHaveBeenCalled();
    });
  });

  describe("When called updateName", () => {
    it("Should update the circleName with the new name", async () => {
      const mockCircle = createMockCircle();
      (Circle.findById as jest.Mock).mockResolvedValue(mockCircle);

      const newCircleName = "newCircleNameTest";
      const result = await service.updateName(circleId, ownerId, newCircleName);

      expect(Circle.findById).toHaveBeenCalledWith(circleId);
      expect(result).toBe(mockCircle);
      expect(result.circleName).toBe(newCircleName);
      expect(mockCircle.save).toHaveBeenCalled();
    });
  });

  describe("When called deleteCircle", () => {
    it("Should delete the Circle", async () => {
      const mockCircle = createMockCircle();
      (Circle.findById as jest.Mock).mockResolvedValue(mockCircle);

      const result = await service.deleteCircle(circleId, ownerId);

      expect(Circle.findById).toHaveBeenCalledWith(circleId);
      expect(Circle.findByIdAndDelete).toHaveBeenCalledWith(circleId);
      expect(result).toBe(undefined);
    });
  });
});
