/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_PROJECT_URL || "https://www.markbase.xyz",
  generateRobotsTxt: true,
};
