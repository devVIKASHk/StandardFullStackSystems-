import { ZodError } from "zod";
import AppError from "../utils/AppError.js";

const validate = (schema) => {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const message = error.issues
                    .map(issue => issue.message)
                    .join(", ");

                throw new AppError(message, 400, "ZodError");
            }

            throw error;
        }
    };
};

export default validate;