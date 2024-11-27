import { createUploadthing, type FileRouter } from "uploadthing/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

const f = createUploadthing();

const auth = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");
    return session.user;
  } catch (error) {
    throw new Error("Authentication failed");
  }
};

export const uploadRouter = {
    // Example "profile picture upload" route - these can be named whatever you want!
    profilePicture: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1,
            minFileCount: 1
        }
    })
        .middleware(async ({ req }) => await auth(req))
        .onUploadComplete(async ({ metadata, file }) => {
            return { uploadedBy: metadata.name, url: file.url };
        }),

    // This route takes an attached image OR video
    messageAttachment: f(["image", "video"])
        .middleware(async ({ req }) => await auth(req))
        .onUploadComplete(() => {}),

    // Takes exactly ONE image up to 2MB
    strictImageAttachment: f({
        image: { maxFileSize: "2MB", maxFileCount: 1, minFileCount: 1 },
    })
        .middleware(async ({ req }) => await auth(req))
        .onUploadComplete(async ({ metadata, file }) => {
            return { uploadedBy: metadata.name, url: file.url };
        }),

    // Takes exactly ONE PDF or EPUB up to 4MB
    strictPdfAttachment: f({
        pdf: { maxFileSize: "128MB", maxFileCount: 1, minFileCount: 1 },
    })
        .middleware(async ({ req }) => await auth(req))
        .onUploadComplete(() => {}),

    // Takes up to 4 2mb images and/or 1 256mb video
    mediaPost: f({
        image: { maxFileSize: "2MB", maxFileCount: 4 },
        video: { maxFileSize: "256MB", maxFileCount: 1 },
    })
        .middleware(async ({ req }) => await auth(req))
        .onUploadComplete(() => {}),

    // Takes up to 4 2mb images, and the client will not resolve
    // the upload until the `onUploadComplete` resolved.
    withAwaitedServerData: f(
        { image: { maxFileSize: "2MB", maxFileCount: 4 } },
        { awaitServerData: true },
    )
        .middleware(async ({ req }) => await auth(req))
        .onUploadComplete((data) => {
            return { foo: "bar" as const };
        }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
