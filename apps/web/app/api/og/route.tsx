import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') ?? 'Purpose-built software for work that cannot run on guesswork.';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#090a0b',
          color: '#d8d9dc',
          display: 'flex',
          padding: '48px'
        }}
      >
        <div
          style={{
            width: '100%',
            border: '2px solid #26272b',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '54px 58px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 24, letterSpacing: '0.18em', color: '#ff612c' }}>MBMAPPS</div>
            <div style={{ fontSize: 18, color: '#858892' }}>independent software studio</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.035em', maxWidth: 1020 }}>{title}</div>
            <div style={{ marginTop: 32, width: 132, height: 8, background: '#ff612c' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, color: '#858892' }}>
            <div>catering operations / youth sports / quote-to-event work</div>
            <div>mbmapps.com</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
