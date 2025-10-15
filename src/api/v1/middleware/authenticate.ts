import { Request, Response, NextFunction } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { auth } from "../../../../config/firebaseConfig";

/**
 * Middleware to authenticate a user using Firebase ID token.
 *
 * @param req - The Express request object
 * @param res - The Express response object
 * @param next - The Express next middleware function
 */
const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader: string | undefined = req.headers.authorization;
        // Does it look like this 'Bearer {token-id}'
        // Bearer token-id => splits into [0:"Bearer", 1:"token-id"]
        const token: string | undefined = authHeader?.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : undefined;

        if (!token) {
            res.status(401).json({
                status:"error",
                error:{ message: "Unauthorized: No token provided" },
            });
            return;
        }

        const decodedToken: DecodedIdToken = await auth.verifyIdToken(token);

        // storing the user's id and role in the resposne for use in other middleware or routes
        res.locals.uid = decodedToken.uid;
        res.locals.role = decodedToken.role;

        next();
    } catch {
        res.status(401).json({
                status:"error",
                error:{ message: "Unauthorized: Invalid token provided" },
        });
    }
};

export default authenticate;
