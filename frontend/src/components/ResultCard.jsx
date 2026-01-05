import ComparisonSlider from "./ComparisonSlider";
import RiskGauge from "./RiskGauge";

export default function ResultCard({ result }) {
  if (!result) return null;

  <ForensicGauge score={result.score} />

  const labelColor =
    result.label === "FAKE"
      ? "#ff4d4f"
      : result.label === "REAL"
      ? "#52c41a"
      : "#faad14";

  return (
    <div
      style={{
        marginTop: "2rem",
        maxWidth: "460px",
        width: "100%",
      }}
    >
      {/* Result */}
      <h2 style={{ marginBottom: "0.4rem" }}>
        Result: <span style={{ color: labelColor }}>{result.label}</span>
      </h2>

      <p style={{ opacity: 0.85 }}>
        Confidence Score: <strong>{riskScore}%</strong>
      </p>

      <p style={{ opacity: 0.7, marginTop: "0.3rem" }}>
        Faces Detected: <strong>{result.faces_detected}</strong>
      </p>

      {/* Gauge */}
      <div style={{ marginTop: "1.8rem" }}>
        <RiskGauge score={riskScore} />
      </div>

      {/* Heatmap */}
      {result.face_url && result.heatmap_url && (
        <div style={{ marginTop: "2.5rem" }}>
          <h3 style={{ marginBottom: "0.8rem" }}>Visual Explanation</h3>

          <ComparisonSlider
            originalUrl={`http://localhost:8000/${result.face_url}`}
            heatmapUrl={`http://localhost:8000/${result.heatmap_url}`}
          />
        </div>
      )}
    </div>
  );
}