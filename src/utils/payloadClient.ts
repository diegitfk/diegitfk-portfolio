import {PayloadSDK} from "@payloadcms/sdk"
import { Config } from "@/payload-types"

export const clientSDK = new PayloadSDK<Config>({
    baseURL : `${process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3000"}/api`,
})