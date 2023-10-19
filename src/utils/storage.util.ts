export const getPlatformPublicKey = async (): Promise<string> => {
  const { default: zeroant } = await import ('loaders/zeroant.js')
  return zeroant.getConfig().platformPublicKey
}
