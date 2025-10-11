/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com"
            }
        ]
    },
    transpilePackages: ["@repo/db"]
};

export default nextConfig;
