import ratelimit from "express-rate-limit";

export const requestLimiter = ratelimit({
    windowMs: 15 * 60 * 1000, // How long you enable each IP to send requests (15 mins)
    max: 100, // Limit each IP address to 100 requests per 15 mins
    legacyHeaders: false, // No legacy Header!
});