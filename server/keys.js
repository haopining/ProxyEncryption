const { createDiffieHellman, DiffieHellman } = require("node:crypto");
const { createClient } = require("redis");
const redis = createClient({ url: "redis://:@redis" });

redis.on("error", (err) => console.log(err));
redis.connect();

/**
 * @returns {Promise<DiffieHellman>}
 */
const getKeyBase = async () => {
    try {
        const server_base = createDiffieHellman(process.env.prime, "hex", 2);
        const msk = await getMasterKey();
        if (msk !== null) server_base.setPrivateKey(msk, "hex");
        server_base.generateKeys();
        await saveMasterKey(server_base.getPrivateKey("hex"));
        return server_base;
    } catch (err) {
        console.error(err);
        throw "DIFFIEHELLMAN_MASTER_KEYGEN_ERROR";
    }
};

/**
 * @param {string} msk
 */
const saveMasterKey = async (msk) => {
    try {
        await redis.set("MSK", msk);
    } catch (err) {
        console.error(err);
        throw "REDIS_SAVE_MASTERKEY_ERROR";
    }
};

/**
 * @returns {Promise<string | null>}
 */
const getMasterKey = async () => {
    try {
        return await redis.get("MSK");
    } catch (err) {
        console.error(err);
        throw "REDIS_GET_MASTERKEY_ERROR";
    }
};

/**
 * @param {string} host
 * @param {string} key
 */
const saveShareKey = async (host, key) => {
    try {
        await redis.set(host, key);
    } catch (err) {
        console.error(err);
        throw "REDIS_SAVE_SHAREKEY_ERROR";
    }
};

/**
 * @param {string} host
 * @returns {Promise<string | null>}
 */
const getShareKey = async (host) => {
    try {
        return await redis.get(host);
    } catch (err) {
        console.error(err);
        throw "REDIS_GET_SHAREKEY_ERROR";
    }
};

module.exports = { getKeyBase, getShareKey, saveShareKey, redis };