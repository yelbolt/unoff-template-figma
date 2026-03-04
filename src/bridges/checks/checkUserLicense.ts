const checkUserLicense = async () => {
  const licenseKey = await figma.clientStorage.getAsync('user_license_key')
  const instanceId = await figma.clientStorage.getAsync(
    'user_license_instance_id'
  )

  if (licenseKey && instanceId)
    return figma.ui.postMessage({
      type: 'CHECK_USER_LICENSE',
      data: {
        licenseKey: licenseKey,
        instanceId: instanceId,
      },
    })
  return true
}

export default checkUserLicense
