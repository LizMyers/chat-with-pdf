/** @type {import('next').NextConfig} */
const nextConfig = {
    //images
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.imgur.com',
            }
        ],

    },
};

export default nextConfig;
