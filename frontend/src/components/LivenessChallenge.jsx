import { useRef, useEffect, useState } from "react"

import { startCamera, captureFrame } from "../utils/camera"

import {
  startChallengeSession,
  sendFrame,
  analyzeChallenge
} from "../services/challengeAPI"


export default function LivenessChallenge() {

  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const [running, setRunning] = useState(false)
  const [result, setResult] = useState(null)


  useEffect(() => {
    startCamera(videoRef)
  }, [])


  function flashScreen() {

    const overlay = document.createElement("div")

    overlay.style.position = "fixed"
    overlay.style.top = 0
    overlay.style.left = 0
    overlay.style.width = "100%"
    overlay.style.height = "100%"
    overlay.style.background = "red"
    overlay.style.zIndex = 9999

    document.body.appendChild(overlay)

    setTimeout(() => {
      document.body.removeChild(overlay)
    }, 200)
  }


  async function runChallenge() {

    setRunning(true)
    setResult(null)

    try {

      const session = await startChallengeSession()
      const sessionId = session.session_id

      // --------------------
      // Baseline frames
      // --------------------

      for (let i = 0; i < 3; i++) {

        const frame = await captureFrame(videoRef, canvasRef)

        await sendFrame(sessionId, frame)

        await new Promise(r => setTimeout(r, 200))
      }


      // --------------------
      // Flash challenge
      // --------------------

      flashScreen()

      await new Promise(r => setTimeout(r, 250))


      // --------------------
      // Flash frames
      // --------------------

      for (let i = 0; i < 4; i++) {

        const frame = await captureFrame(videoRef, canvasRef)

        await sendFrame(sessionId, frame)

        await new Promise(r => setTimeout(r, 200))
      }


      // --------------------
      // Analyze
      // --------------------

      const analysis = await analyzeChallenge(sessionId)

      setResult(analysis)

    } catch (err) {

      console.error(err)

    }

    setRunning(false)
  }



  return (

    <div style={{ marginTop: 40 }}>

      <h2>Liveness Verification</h2>


      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="420"
        style={{ borderRadius: 10 }}
      />

      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
      />

      <br />
      <br />


      <button
        onClick={runChallenge}
        disabled={running}
        style={{
          padding: "10px 20px",
          fontSize: 16
        }}
      >
        {running ? "Running Challenge..." : "Start Liveness Test"}
      </button>


      {result && (

        <div style={{ marginTop: 20 }}>
          <h3>Analysis Result</h3>
          <p>Baseline Red Mean: {result.baseline_red_mean}</p>
          <p>Flash Red Mean: {result.flash_red_mean}</p>
          <p>Delta Intensity: {result.delta_intensity}</p>
          <p>{result.verdict}</p>
        </div>
      )}

    </div>

  )
}