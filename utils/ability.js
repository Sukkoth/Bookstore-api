import { AbilityBuilder } from "@casl/ability";
import { createPrismaAbility } from "@casl/prisma";

export function defineAbility(userType, userId) {
  const { can, cannot, build } = new AbilityBuilder(createPrismaAbility);

  if (userType === "admin") {
    can("manage", "Owners");
    can("manage", "Transactions");
    can("read", "OwnerToBooks");
    can("approve", "OwnerToBooks");
  } else if (userType === "owner") {
    can("create", "OwnerToBooks");
    can("read", "OwnerToBooks", { ownerId: userId, approved: true });
    can("delete", "OwnerToBooks", { ownerId: userId, approved: true });
    can("update", "OwnerToBooks", { ownerId: userId, approved: true });
    cannot("update", "OwnerToBooks", { ownerId: userId, approved: false });
  } else if (userType === "user") {
    can("read", "OwnerToBooks");
  } else {
    throw new Error("No such user type to define ability for");
  }
  return build();
}
