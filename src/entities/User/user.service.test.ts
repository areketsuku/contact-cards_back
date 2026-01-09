import { Circle } from "../Circle/circle.model";
import { User } from "./user.model";
import { UserService } from "./user.service";

jest.mock("./user.model", () => ({
  User: {
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

jest.mock("../Circle/circle.model", () => ({
  Circle: {
    findOne: jest.fn(),
  },
}));

describe("Given a UserService", () => {
  let service: UserService;

  const createMockUser = () => ({
    userName: "testName",
    userSurname1: "testSurname1",
    userSurname2: "testSurname2",
    userEmail1: "testEmail1@example.com",
    userEmail2: "",
    userPhone1: "123456789",
    userPhone2: "987654321",
    userCountry: "",
    userAddress: "",
    userLink1: "http://link1.com",
    userLink2: "",
    userAvatar: "",
    userPassword: "plainPassword",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const allowedCircle = {
    circleOwnerId: "targetId",
    circleContacts: ["requestId"],
    circleAllowedInfo: {
      userName: true,
      userSurname1: false,
      userSurname2: false,
      userEmail1: true,
      userEmail2: false,
      userPhone1: true,
      userPhone2: false,
      userCountry: false,
      userAddress: false,
      userLink1: false,
      userLink2: false,
      userAvatar: true,
    },
  };

  beforeEach(() => {
    service = new UserService();
    jest.clearAllMocks();
  });

  describe("When called createUser", () => {
    it("Should create a new user with the provided data", async () => {
      const mockUserData = createMockUser();
      (User.create as jest.Mock).mockResolvedValue({ ...mockUserData, });

      const result = await service.createUser(mockUserData);

      expect(User.create).toHaveBeenCalledWith(mockUserData);
      expect(result).toStrictEqual(mockUserData);
    });
  });

  describe("When called getUserById", () => {
    it("Should return the user if found", async () => {
      const mockUserData = createMockUser();
      (User.findById as jest.Mock).mockResolvedValue(mockUserData);

      const result = await service.getUserById("anyId");

      expect(User.findById).toHaveBeenCalledWith("anyId");
      expect(result).toEqual(mockUserData);
    });

    it("Should throw error if user not found", async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.getUserById("anyId")).rejects.toThrow("User not found");
      expect(User.findById).toHaveBeenCalledWith("anyId");
    });
  });

  describe("When called showUserInfo", () => {
    it("should return full info when requester is the same as target", async () => {
      const mockUserData = createMockUser();
      (User.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(mockUserData) });

      const result = await service.showUserInfo("targetId", "targetId");

      expect(User.findById).toHaveBeenCalledWith("targetId");
      expect(result).toEqual(mockUserData);
    });

    it("should return only allowed fields when requester is a contact", async () => {
      const mockUserData = createMockUser();
      (User.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(mockUserData) });
      (Circle.findOne as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(allowedCircle) });

      const result = await service.showUserInfo("requestId", "targetId");

      expect(User.findById).toHaveBeenCalledWith("targetId");
      expect(Circle.findOne).toHaveBeenCalledWith({
        circleOwnerId: "targetId",
        circleContacts: "requestId",
      });
      expect(result).toEqual({
        userName: "testName",
        userEmail1: "testEmail1@example.com",
        userPhone1: "123456789",
        userAvatar: "",
      });
    });

    it("should throw an error if target user does not exist", async () => {
      (User.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });

      await expect(service.showUserInfo("requestId", "targetId")).rejects.toThrow("User not found");
    });

    it("should throw an error if requester is not in any circle", async () => {
      const mockUserData = createMockUser();

      (User.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(mockUserData) });
      (Circle.findOne as jest.Mock).mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });

      await expect(service.showUserInfo("requestId", "targetId"))
        .rejects.toThrow("Error: requester does not exist in circles from target");
    });

  });

  describe("When called updateUser", () => {
    it("Should update the user when authUserId equals targetUserId", async () => {
      const updates = { userName: "NewName" };
      const updatedUser = { ...createMockUser(), ...updates };
      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.updateUser("targetId", "targetId", updates);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "targetId",
        updates,
        { new: true }
      );
      expect(result).toEqual(updatedUser);
    });

    it("Should throw error if authUserId is different from targetUserId", async () => {
      const updates = { userName: "NewName" };

      await expect(service.updateUser("otherId", "targetId", updates)).rejects.toThrow("Unauthorized");
    });

    it("Should throw error if updates contain userEmail1", async () => {
      const updates = { userEmail1: "new@example.com" };

      await expect(service.updateUser("targetId", "targetId", updates)).rejects.toThrow("Error: userEmail1 cannot be updated");
    });

    it("Should throw error if target user does not exist", async () => {
      const updates = { userName: "NewName" };
      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(service.updateUser("targetId", "targetId", updates)).rejects.toThrow("User not found");
    });
  });

  describe("When called deleteUser", () => {
    it("should delete the user when authUserId equals targetUserId", async () => {
      const mockUserData = createMockUser();
      (User.findByIdAndDelete as jest.Mock).mockResolvedValue(mockUserData);

      await expect(service.deleteUser("targetId", "targetId")).resolves.toBeUndefined();
      expect(User.findByIdAndDelete).toHaveBeenCalledWith("targetId");
    });

    it("should throw error if authUserId is different from targetUserId", async () => {
      await expect(service.deleteUser("otherId", "targetId"))
        .rejects.toThrow("Unauthorized");
    });

    it("should throw error if target user does not exist", async () => {
      (User.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteUser("targetId", "targetId"))
        .rejects.toThrow("User not found");
    });
  });
});
