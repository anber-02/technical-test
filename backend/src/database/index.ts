import { PrismaClient, Prisma } from "@prisma/client";
export * from "@prisma/client";

export const db = new PrismaClient()
  .$extends({
    result: {
      user: {
        profilePictureUrl: {
          needs: { profilePicture: true },
          compute: (user) => {
            if (!user?.profilePicture) return null;
            const baseUrl = process.env.APP_URL || "http://localhost:3000";
            return `${baseUrl}/${user.profilePicture}`;
          },
        },
      },
    },
  })
  .$extends({
    name: "paginate",
    model: {
      $allModels: {
        async paginate<T, Args>(
          this: T,
          args: Prisma.Exact<
            Args,
            Omit<Prisma.Args<T, "findMany">, "cursor" | "take" | "skip">
          > & {
            page?: number;
            limit?: number;
          }
        ) {
          const { page = 1, limit = 25, ...queryArgs } = args as any;

          const [data, total] = await Promise.all([
            (this as any).findMany({
              ...queryArgs,
              skip: (page - 1) * limit,
              take: limit,
            }),
            (this as any).count({ where: queryArgs.where }),
          ]);

          return {
            data,
            meta: {
              total,
              page,
              limit,
              totalPages: Math.ceil(total / limit),
              hasNextPage: page < Math.ceil(total / limit),
              hasPreviousPage: page > 1,
            },
          };
        },
      },
    },
  });
