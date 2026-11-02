import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'JP Smart Solutions Academy';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #071525 0%, #0b2d55 55%, #0B63CE 100%)',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#14B8D4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#071525',
            }}
          >
            JP
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#ffffff', fontSize: '20px', fontWeight: '800' }}>
              JP SMART SOLUTIONS
            </span>
            <span style={{ color: '#14B8D4', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>
              ENGINEERING ACADEMY
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '850px' }}>
          <div
            style={{
              display: 'flex',
              color: '#14B8D4',
              fontSize: '18px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
            }}
          >
            Practical Technical Training • Port Harcourt, Nigeria
          </div>
          <div
            style={{
              color: '#ffffff',
              fontSize: '48px',
              fontWeight: '900',
              lineHeight: 1.15,
            }}
          >
            Learn the engineering skills employers actually use.
          </div>
          <div style={{ color: '#C0CDDC', fontSize: '22px', lineHeight: 1.4 }}>
            ETAP Software • Power System Analysis • Protection Relay Coordination • Solar PV System Design
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', color: '#85BFFF', fontSize: '16px' }}>
          <span>100% Online & Self-Paced</span>
          <span>•</span>
          <span>Practical Single-Line Diagram Models</span>
          <span>•</span>
          <span>expert-led masterclasses</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
