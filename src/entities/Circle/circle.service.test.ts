import { CircleService } from "./circle.service";
import { Circle } from "./circle.model";

jest.mock("./circle.model", () => ({
  Circle: {
    create: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

jest.mock("mongoose", () => {
  const original = jest.requireActual("mongoose");
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
  });

  const createMockCircle = (overrides: Partial<CircleService> = {}) => ({
    circleOwnerId: ownerId,
    circleType: "default",
    circleName: "contacts",
    circleContacts: ["circleContactTest"],
    circleAllowedInfo: {
      name: true,
      surname1: false,
      surname2: false,
      email1: false,
      email2: false,
      phone1: false,
      phone2: false,
      country: false,
      address: false,
      link1: false,
      link2: false,
      avatar: false,
    },
    save: jest.fn().mockResolvedValue(true),
    findByIdAndDelete: jest.fn().mockResolvedValue(true),
    ...overrides,
  });

  describe("When called createDefaultCircle", () => {
    it("Should return a default circle with Type 'default' and name 'contacts'", async () => {
      (Circle.create as jest.Mock).mockImplementation((circleData) => ({
        ...createMockCircle(),
        ...circleData,
      }));

      const result = await service.createDefaultCircle(ownerId);

      expect(result.circleType).toBe("default");
      expect(result.circleName).toBe("contacts");
    });
  });

  describe("When called createCustomCircle", () => {
    it("Should return a circle with Type 'custom' and custom name", async () => {
      (Circle.create as jest.Mock).mockImplementation((circleData) => ({
        ...createMockCircle(),
        ...circleData,
      }));

      const result = await service.createCustomCircle(ownerId, "esport");

      expect(result.circleType).toBe("custom");
      expect(result.circleName).toBe("esport");
    });
  });

  describe("When called getDefaultCircle", () => {
    it("Should return the default circle with type 'default', name 'contacts' and coinciding ownerID", async () => {
      const mockCircle = createMockCircle();
      (Circle.findOne as jest.Mock).mockResolvedValue(mockCircle);

      const result = await service.getDefaultCircle(ownerId);

      expect(Circle.findOne).toHaveBeenCalledWith({
        circleOwnerId: ownerId,
        circleType: "default",
      });
      expect(result).toBe(mockCircle);
    });

    it("Should return error if default circle does not exists", async () => {
      (Circle.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.getDefaultCircle(ownerId)).rejects.toThrow(
        "Error: default circle does not exists"
      );
    });
  });

  describe("When called a method that operates with a circle", () => {
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

      const result = await service.hasContact(
        circleId,
        ownerId,
        "notCircleContactTest"
      );

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

      const result = await service.addContact(
        circleId,
        ownerId,
        "newCircleContactTest"
      );

      expect(Circle.findById).toHaveBeenCalledWith(circleId);
      expect(result).toBe(mockCircle);
      expect(
        result.circleContacts.some(
          (c) => c.toString() === "newCircleContactTest"
        )
      ).toBe(true);
      expect(mockCircle.save).toHaveBeenCalled();
    });
  });

  describe("When called removeContact", () => {
    it("Should delete contact from circleContacts and return the Circle", async () => {
      const mockCircle = createMockCircle();
      (Circle.findById as jest.Mock).mockResolvedValue(mockCircle);

      const result = await service.removeContact(
        circleId,
        ownerId,
        "circleContactTest"
      );

      expect(Circle.findById).toHaveBeenCalledWith(circleId);
      expect(result).toBe(mockCircle);
      expect(
        result.circleContacts.some((c) => c.toString() === "circleContactTest")
      ).toBe(false);
      expect(mockCircle.save).toHaveBeenCalled();
    });
  });

  describe("When called updateAllowedInfo", () => {
    it("Should update circleAllowedInfo with the new info allowed", async () => {
      const mockCircle = createMockCircle();
      (Circle.findById as jest.Mock).mockResolvedValue(mockCircle);

      const newAllowedInfo = {
        userName: true,
        userSurname1: true,
        userSurname2: false,
        userEmail1: true,
        userEmail2: false,
        userPhone1: true,
        userPhone2: false,
        userCountry: false,
        userAddress: false,
        userLink1: true,
        userLink2: false,
        userAvatar: true,
      };

      const result = await service.updateAllowedInfo(
        circleId,
        ownerId,
        newAllowedInfo
      );

      expect(Circle.findById).toHaveBeenCalledWith(circleId);
      expect(result).toBe(mockCircle);
      expect(result.circleAllowedInfo).toMatchObject(newAllowedInfo);
      expect(mockCircle.save).toHaveBeenCalled();
    });
  });

  describe("When called updateName", () => {
    it("Should update the circleName with the new name", async () => {
      const mockCircle = createMockCircle();
      mockCircle.circleType = "custom";
      mockCircle.circleName = "oldName";
      (Circle.findById as jest.Mock).mockResolvedValue(mockCircle);

      const newCircleName = "newCircleNameTest";
      const result = await service.updateName(circleId, ownerId, newCircleName);

      expect(Circle.findById).toHaveBeenCalledWith(circleId);
      expect(result).toBe(mockCircle);
      expect(result.circleName).toBe(newCircleName);
      expect(mockCircle.save).toHaveBeenCalled();
    });

    it("Should return an error if trying to rename default circle", async () => {
      (Circle.findById as jest.Mock).mockResolvedValue(createMockCircle());

      await expect(
        service.updateName(circleId, ownerId, "newName")
      ).rejects.toThrow("Error: can't rename default circle");
    });
  });

  describe("When called deleteCircle", () => {
    it("Should delete the Circle", async () => {
      const mockCircle = createMockCircle();
      mockCircle.circleType = "custom";
      mockCircle.circleName = "oldName";
      (Circle.findById as jest.Mock).mockResolvedValue(mockCircle);

      const result = await service.deleteCircle(circleId, ownerId);

      expect(Circle.findById).toHaveBeenCalledWith(circleId);
      expect(Circle.findByIdAndDelete).toHaveBeenCalledWith(circleId);
      expect(result).toBe(undefined);
    });

    it("Should return an error if tring to delete default circle", async () => {
      (Circle.findById as jest.Mock).mockResolvedValue(createMockCircle());

      await expect(service.deleteCircle(circleId, ownerId)).rejects.toThrow(
        "Error: can't delete default circle"
      );
    });
  });
});
