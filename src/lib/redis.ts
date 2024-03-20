import { createClient } from "redis";

export const redis = createClient({
	url: "redis://:docker@redis:6379/",
});

redis.connect();
