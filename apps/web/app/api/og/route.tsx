import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') ?? 'MBMApps';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(145deg, #06111f, #0a213c 55%, #0f3f57)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px'
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: '0.22em', color: '#69eec1' }}>MBMAPPS</div>
        <div style={{ marginTop: 24, fontSize: 68, fontWeight: 700, lineHeight: 1.1, maxWidth: 980 }}>{title}</div>
        <div style={{ marginTop: 28, fontSize: 26, color: '#c3d8ff' }}>High-quality web technology at scale</div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
