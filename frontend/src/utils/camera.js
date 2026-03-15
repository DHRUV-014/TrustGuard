export async function startCamera(videoRef) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true
  })

  videoRef.current.srcObject = stream
}

export function captureFrame(videoRef, canvasRef) {

  const video = videoRef.current
  const canvas = canvasRef.current

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  const ctx = canvas.getContext("2d")
  ctx.drawImage(video, 0, 0)

  return new Promise(resolve => {
    canvas.toBlob(resolve, "image/jpeg")
  })
}

export function stopCamera(videoRef) {

  const stream = videoRef.current.srcObject

  if (!stream) return

  stream.getTracks().forEach(track => track.stop())
}