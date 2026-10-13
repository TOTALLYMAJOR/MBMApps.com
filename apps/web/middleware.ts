import { NextRequest, NextResponse } from 'next/server';
import { GATE_COOKIE_NAME, getGateConfiguration, readGateSession } from '@/lib/site-gate';

function isPublicEntrancePath(pathname: string) {
  return pathname === '/gate'
    || pathname === '/api/site-gate'
    || pathname.startsWith('/_next/')
    || pathname === '/icon.svg'
    || pathname === '/favicon.ico';
}

export async function middleware(request: NextRequest) {
  const configuration = getGateConfiguration();
  if (isPublicEntrancePath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (!configuration.configured) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ ok: false, message: 'Site access is not configured.' }, { status: 503 });
    }
    return redirectToEntrance(request);
  }

  const token = request.cookies.get(GATE_COOKIE_NAME)?.value;
  const session = await readGateSession(token, configuration.secret);
  if (session?.role === 'member') {
    return NextResponse.next();
  }

  if (session?.role === 'guest') {
    if (request.nextUrl.pathname === '/discuss') {
      const home = request.nextUrl.clone();
      home.pathname = '/';
      home.search = '';
      return NextResponse.redirect(home);
    }
    if (request.nextUrl.pathname === '/api/chat') {
      return NextResponse.json({ ok: false, message: 'Member access is required.' }, { status: 403 });
    }
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json(
      { ok: false, message: 'Signal Lock access is required.' },
      { status: 401 }
    );
  }

  return redirectToEntrance(request);
}

function redirectToEntrance(request: NextRequest) {
  const entrance = request.nextUrl.clone();
  entrance.pathname = '/gate';
  entrance.search = '';
  entrance.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(entrance);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg).*)']
};
