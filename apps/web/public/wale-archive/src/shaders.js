export const quadVertex = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;

    gl_Position = projectionMatrix *
      modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fieldFunctions = /* glsl */ `
  const float TAU = 6.28318530718;

  float hash12(vec2 p) {
    return fract(
      sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123
    );
  }

  vec4 seed4(vec2 uv) {
    return vec4(
      hash12(uv + 0.123),
      hash12(uv + 3.719),
      hash12(uv + 7.317),
      hash12(uv + 13.113)
    );
  }

  vec3 rotateX(vec3 p, float angle) {
    float c = cos(angle);
    float s = sin(angle);

    return vec3(
      p.x,
      c * p.y - s * p.z,
      s * p.y + c * p.z
    );
  }

  vec3 rotateZ(vec3 p, float angle) {
    float c = cos(angle);
    float s = sin(angle);

    return vec3(
      c * p.x - s * p.y,
      s * p.x + c * p.y,
      p.z
    );
  }

  // Analytic curl of a trigonometric vector potential.
  vec3 curlField(vec3 p, float time) {
    float a = 1.3 * p.y + time;
    float b = 1.1 * p.z - 0.4 * time;

    float c = 1.2 * p.z + 0.7 * time;
    float d = 1.4 * p.x + 0.2 * time;

    float e = 1.1 * p.x - 0.6 * time;
    float f = 1.3 * p.y + 0.3 * time;

    return vec3(
      -1.3 * sin(e) * sin(f)
        - 1.2 * cos(c) * cos(d),

      -1.1 * sin(a) * sin(b)
        - 1.1 * cos(e) * cos(f),

      -1.4 * sin(c) * sin(d)
        - 1.3 * cos(a) * cos(b)
    ) * 0.45;
  }

  vec3 layeredCurl(vec3 p, float time) {
    return
      curlField(p * 0.65, time) * 0.65 +
      curlField(p * 1.35 + 4.0, time * 0.8) * 0.25 +
      curlField(p * 2.8 - 3.0, time * 0.6) * 0.10;
  }

  vec3 orbitalPath(float t, float lane) {
    float angle = t * TAU + lane * 0.43;

    float radius =
      2.35 +
      0.12 * sin(angle * 3.0 + lane);

    vec3 p = vec3(
      radius * cos(angle),
      0.15 * sin(angle * 2.0 + lane),
      radius * sin(angle)
    );

    p = rotateX(p, 0.25 + lane * 0.43);
    p = rotateZ(p, -0.45 + lane * 0.31);

    return p;
  }
`;

const simulationUniforms = /* glsl */ `
  uniform float uTime;
  uniform float uPhase;
  uniform float uDelta;
  uniform float uSnap;

  uniform float uTurbulence;
  uniform float uPointerGain;
  uniform vec3 uPointer;
`;

const targetFunction = /* glsl */ `
  vec3 targetPosition(vec4 seed, float age) {
    float lane = floor(seed.y * 7.0);
    float t = age;

    vec3 orbit = orbitalPath(t, lane);

    vec3 disturbance = layeredCurl(
      orbit + seed.xyz * 2.0,
      uTime * 0.12
    );

    vec3 discovery =
      orbit * mix(1.2, 1.85, seed.z) +
      disturbance * 0.40;

    discovery.y += sin(
      t * TAU + lane * 0.4
    ) * 0.4;

    vec3 association =
      orbit * mix(1.0, 1.12, seed.z) +
      disturbance * 0.10;

    float checkpoint =
      t + sin(t * TAU * 4.0) * 0.028;

    vec3 evaluation =
      orbitalPath(checkpoint, lane) +
      disturbance * 0.035;

    float accepted = step(0.24, seed.w);
    float rejected = 1.0 - accepted;

    evaluation *=
      1.0 +
      rejected *
      smoothstep(0.30, 0.92, t) *
      0.65;

    float radius = mix(
      4.4,
      0.58,
      smoothstep(0.0, 1.0, t)
    );

    float angle = t * TAU * 2.2 + lane * 0.63;

    vec3 integration = vec3(
      cos(angle) * radius,
      (0.5 - t) * 1.7 +
        sin(angle * 0.5 + lane) * radius * 0.10,
      sin(angle) * radius
    );

    integration = rotateX(
      integration,
      0.45 + lane * 0.25
    );

    integration = rotateZ(
      integration,
      -0.22
    );

    integration = mix(
      integration,
      orbit * 1.8 + disturbance * 0.16,
      rejected
    );

    float latitude = acos(1.0 - 2.0 * seed.y);

    float longitude =
      floor(seed.x * 192.0) / 192.0 * TAU +
      uTime * 0.035;

    float architecture =
      1.90 +
      0.26 *
      sin(latitude * 5.0 + longitude * 3.0) *
      sin(latitude);

    vec3 evolution = vec3(
      sin(latitude) * cos(longitude),
      cos(latitude) * 1.12,
      sin(latitude) * sin(longitude)
    ) * architecture;

    evolution = mix(
      evolution,
      orbit * 1.65,
      rejected
    );

    vec3 target = mix(
      discovery,
      association,
      smoothstep(0.0, 1.0, uPhase)
    );

    target = mix(
      target,
      evaluation,
      smoothstep(1.0, 2.0, uPhase)
    );

    target = mix(
      target,
      integration,
      smoothstep(2.0, 3.0, uPhase)
    );

    target = mix(
      target,
      evolution,
      smoothstep(3.0, 4.0, uPhase)
    );

    return target;
  }
`;

export const simulationPosition = /* glsl */ `
  ${simulationUniforms}
  ${fieldFunctions}
  ${targetFunction}

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec4 state = texture2D(texturePosition, uv);
    vec3 velocity = texture2D(textureVelocity, uv).xyz;

    vec4 seed = seed4(uv);

    float age = state.w;

    if (uSnap > 0.5) {
      gl_FragColor = vec4(
        targetPosition(seed, age),
        age
      );

      return;
    }

    age += uDelta * (0.035 + seed.z * 0.009);

    vec3 position = state.xyz + velocity * uDelta;

    if (age >= 1.0 || length(position) > 12.0) {
      age = fract(age);

      position = targetPosition(seed, age);
    }

    gl_FragColor = vec4(position, age);
  }
`;

export const simulationVelocity = /* glsl */ `
  ${simulationUniforms}
  ${fieldFunctions}
  ${targetFunction}

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec4 state = texture2D(texturePosition, uv);
    vec3 velocity = texture2D(textureVelocity, uv).xyz;

    vec4 seed = seed4(uv);

    if (uSnap > 0.5) {
      gl_FragColor = vec4(0.0);
      return;
    }

    float nextAge =
      state.w +
      uDelta * (0.035 + seed.z * 0.009);

    if (nextAge >= 1.0) {
      gl_FragColor = vec4(0.0);
      return;
    }

    vec3 target = targetPosition(seed, state.w);

    float coherence = smoothstep(1.0, 4.0, uPhase);
    float stiffness = mix(3.0, 8.5, coherence);

    vec3 acceleration =
      (target - state.xyz) * stiffness;

    acceleration += layeredCurl(
      state.xyz,
      uTime * 0.14
    ) * (
      uTurbulence *
      mix(1.3, 0.18, coherence)
    );

    vec3 separation = state.xyz - uPointer;
    float distanceSquared = dot(separation, separation);

    vec3 direction = normalize(
      separation + vec3(0.0001)
    );

    vec3 disturbance =
      direction * 1.6 +
      cross(direction, vec3(0.2, 0.9, 0.3)) * 1.2;

    acceleration += disturbance *
      uPointerGain *
      exp(-distanceSquared * 0.45);

    velocity += acceleration * uDelta;

    velocity *= exp(
      -mix(2.3, 3.7, coherence) * uDelta
    );

    float speed = length(velocity);

    if (speed > 5.5) {
      velocity *= 5.5 / speed;
    }

    gl_FragColor = vec4(velocity, 0.0);
  }
`;

export const sculptureUniforms = /* glsl */ `
  uniform float uTime;
  uniform float uPhase;
  uniform vec3 uAccent;
`;

export const nucleusSurface = /* glsl */ `
  vec3 nucleusSurface(vec3 p) {
    vec3 n = normalize(p);

    float coherence = smoothstep(0.0, 4.0, uPhase);

    float folds =
      sin(n.x * 5.0 + uTime * 0.10) *
      cos(n.y * 4.0 - uTime * 0.07) * 0.048 +

      sin(n.z * 6.0 + n.y * 2.0) *
      cos(n.x * 3.0 - uTime * 0.06) * 0.030;

    vec3 result = p * (
      1.0 + folds * mix(1.0, 0.65, coherence)
    );

    return result * vec3(0.92, 1.10, 0.94);
  }

  vec3 nucleusNormal(vec3 p) {
    vec3 normal = normalize(p);

    vec3 helper = abs(normal.y) < 0.94
      ? vec3(0.0, 1.0, 0.0)
      : vec3(1.0, 0.0, 0.0);

    vec3 tangent = normalize(cross(helper, normal));
    vec3 bitangent = normalize(cross(normal, tangent));

    float radius = length(p);
    float epsilon = 0.003;

    vec3 center = nucleusSurface(p);

    vec3 a = nucleusSurface(
      normalize(normal + tangent * epsilon) * radius
    );

    vec3 b = nucleusSurface(
      normalize(normal + bitangent * epsilon) * radius
    );

    return normalize(cross(a - center, b - center));
  }
`;

export const membraneSurface = /* glsl */ `
  vec3 membraneSurface(vec2 parameter, float blade) {
    float u = parameter.x;
    float v = parameter.y * 2.0 - 1.0;

    float coherence = smoothstep(0.0, 4.0, uPhase);

    float angle =
      (u - 0.5) * 5.55 +
      blade * 0.897597901 +
      uTime * 0.025;

    float radius =
      1.20 +
      sin(u * 3.14159265) * 0.30 +
      coherence * 0.16;

    float width =
      mix(0.095, 0.31, coherence) *
      pow(
        max(0.001, sin(u * 3.14159265)),
        0.65
      );

    vec3 center = vec3(
      cos(angle) * radius,
      (u - 0.5) * 2.65,
      sin(angle) * radius
    );

    vec3 radial = vec3(
      cos(angle),
      0.0,
      sin(angle)
    );

    float twist = sin(
      u * 6.283185 + blade * 0.6
    );

    vec3 across = normalize(
      radial * (0.75 + twist * 0.25) +
      vec3(0.0, 0.8, 0.0)
    );

    vec3 p = center + across * v * width;

    p += radial * (
      sin(v * 3.14159265) *
      sin(u * 12.0 + blade) *
      0.025
    );

    float lean = sin(blade * 1.4) * 0.18;

    float c = cos(lean);
    float s = sin(lean);

    return vec3(
      c * p.x - s * p.y,
      s * p.x + c * p.y,
      p.z
    );
  }

  vec3 membraneNormal(vec2 parameter, float blade) {
    float epsilon = 0.0015;

    vec3 du =
      membraneSurface(parameter + vec2(epsilon, 0.0), blade) -
      membraneSurface(parameter - vec2(epsilon, 0.0), blade);

    vec3 dv =
      membraneSurface(parameter + vec2(0.0, epsilon), blade) -
      membraneSurface(parameter - vec2(0.0, epsilon), blade);

    return normalize(cross(du, dv));
  }
`;

export const traceVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPhase;

  attribute float aLane;

  varying float vT;
  varying float vLane;
  varying vec3 vNormal;
  varying vec3 vView;

  ${fieldFunctions}

  void main() {
    float t = position.x;
    float around = position.y;

    float flowTime = t + uTime * 0.006;

    vec3 center = orbitalPath(flowTime, aLane);

    vec3 tangent = normalize(
      orbitalPath(flowTime + 0.001, aLane) -
      orbitalPath(flowTime - 0.001, aLane)
    );

    vec3 helper = abs(tangent.z) < 0.94
      ? vec3(0.0, 0.0, 1.0)
      : vec3(0.0, 1.0, 0.0);

    vec3 normal = normalize(cross(tangent, helper));
    vec3 binormal = normalize(cross(tangent, normal));

    vec3 radial =
      normal * cos(around) +
      binormal * sin(around);

    float radius =
      0.0045 +
      smoothstep(2.0, 4.0, uPhase) * 0.0013;

    vec3 p = center + radial * radius;

    vec4 viewPosition =
      modelViewMatrix * vec4(p, 1.0);

    gl_Position =
      projectionMatrix * viewPosition;

    vT = t;
    vLane = aLane;

    vNormal = normalize(normalMatrix * radial);
    vView = -viewPosition.xyz;
  }
`;

export const traceFragment = /* glsl */ `
  uniform float uTime;
  uniform float uPhase;
  uniform vec3 uAccent;
  uniform vec3 uPearl;

  varying float vT;
  varying float vLane;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    float wrapped = abs(
      fract(
        vT -
        uTime * 0.044 +
        vLane * 0.137 +
        0.5
      ) - 0.5
    );

    float pulse = exp(
      -wrapped * wrapped * 1800.0
    );

    float edge = pow(
      1.0 - abs(dot(
        normalize(vNormal),
        normalize(vView)
      )),
      1.7
    );

    float coherence = smoothstep(0.0, 4.0, uPhase);

    vec3 color = mix(
      uPearl,
      uAccent,
      0.35 + coherence * 0.55
    );

    float intensity =
      0.09 +
      coherence * 0.21 +
      edge * 0.08 +
      pulse * (1.1 + coherence * 2.4);

    gl_FragColor = vec4(
      color * intensity,
      0.31 + pulse * 0.5
    );
  }
`;

export const particleVertex = /* glsl */ `
  uniform sampler2D uPositions;

  uniform float uPhase;
  uniform float uPixelScale;
  uniform float uFocus;
  uniform float uMaxPoint;

  uniform vec3 uAccent;
  uniform vec3 uPearl;
  uniform vec3 uAmber;

  attribute vec2 aLookup;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vEnergy;
  varying float vDepth;
  varying float vHighlight;

  ${fieldFunctions}

  void main() {
    vec4 state = texture2D(uPositions, aLookup);
    vec4 seed = seed4(aLookup);

    vec4 viewPosition =
      modelViewMatrix * vec4(state.xyz, 1.0);

    gl_Position =
      projectionMatrix * viewPosition;

    float depth = max(0.1, -viewPosition.z);

    float accepted = step(0.24, seed.w);
    float rejected = 1.0 - accepted;

    float evaluating =
      smoothstep(1.0, 2.0, uPhase);

    float integrating =
      smoothstep(2.0, 3.0, uPhase);

    float evolving =
      smoothstep(3.0, 4.0, uPhase);

    float worldSize =
      0.013 +
      pow(seed.z, 3.0) * 0.030;

    float sharpSize = clamp(
      worldSize * uPixelScale / depth,
      1.1,
      6.0
    );

    float defocus = min(
      5.0,
      abs(depth - uFocus) * 0.7
    );

    float pointSize = min(
      uMaxPoint,
      sharpSize + defocus
    );

    gl_PointSize = pointSize;

    vEnergy = pow(
      sharpSize / max(pointSize, 1.0),
      1.7
    );

    float lifetime =
      smoothstep(0.0, 0.07, state.w) *
      (1.0 - smoothstep(0.92, 1.0, state.w));

    vAlpha =
      (0.28 + seed.z * 0.43) *
      lifetime *
      mix(1.0, 0.12, rejected * evolving);

    vColor = mix(
      uPearl,
      uAccent,
      0.10 + accepted * integrating * 0.82
    );

    vColor = mix(
      vColor,
      uAmber,
      rejected * evaluating * (1.0 - evolving)
    );

    vDepth = depth;
    vHighlight = step(0.985, seed.z) * accepted;
  }
`;

export const particleFragment = /* glsl */ `
  uniform sampler2D uDepth;

  uniform vec2 uResolution;
  uniform float uNear;
  uniform float uFar;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vEnergy;
  varying float vDepth;
  varying float vHighlight;

  float linearDepth(float depth) {
    return (uNear * uFar) /
      (uFar - depth * (uFar - uNear));
  }

  void main() {
    vec2 screenUv = gl_FragCoord.xy / uResolution;

    float sceneDepth = linearDepth(
      texture2D(uDepth, screenUv).x
    );

    if (vDepth > sceneDepth + 0.025) discard;

    vec2 p = gl_PointCoord * 2.0 - 1.0;
    float radiusSquared = dot(p, p);

    if (radiusSquared > 1.0) discard;

    vec3 normal = vec3(
      p,
      sqrt(max(0.0, 1.0 - radiusSquared))
    );

    float diffuse = 0.32 + 0.68 * max(
      dot(normal, normalize(vec3(-0.4, 0.65, 1.0))),
      0.0
    );

    float core = exp(-radiusSquared * 5.5);
    float halo = exp(-radiusSquared * 2.0) * 0.10;

    float edge = 1.0 - smoothstep(
      0.60,
      1.0,
      radiusSquared
    );

    float alpha =
      (core + halo) *
      edge *
      vAlpha *
      vEnergy *
      exp(-vDepth * 0.008);

    vec3 color =
      vColor *
      diffuse *
      (0.75 + vHighlight * 3.0);

    gl_FragColor = vec4(color, alpha);
  }
`;

export const dofFragment = /* glsl */ `
  uniform sampler2D tDiffuse;
  uniform sampler2D uDepth;

  uniform vec2 uResolution;

  uniform float uNear;
  uniform float uFar;
  uniform float uFocus;
  uniform float uAperture;

  varying vec2 vUv;

  float depthAt(vec2 uv) {
    float depth = texture2D(uDepth, uv).x;

    return (uNear * uFar) /
      (uFar - depth * (uFar - uNear));
  }

  float blurAt(float depth) {
    return clamp(
      (depth - uFocus) /
        max(depth, 0.1) *
        uAperture,
      -18.0,
      18.0
    );
  }

  void main() {
    float centerDepth = depthAt(vUv);
    float centerBlur = blurAt(centerDepth);

    vec3 sum = texture2D(tDiffuse, vUv).rgb;
    float totalWeight = 1.0;

    for (int i = 0; i < DOF_SAMPLES; i++) {
      bool outer = i >= DOF_SAMPLES / 2;

      float sampleIndex = outer
        ? float(i - DOF_SAMPLES / 2) + 0.5
        : float(i) + 0.5;

      float fraction =
        sampleIndex / float(DOF_SAMPLES / 2);

      float radius = sqrt(fraction) * (
        outer
          ? 18.0
          : max(0.4, abs(centerBlur))
      );

      float angle = sampleIndex * 2.39996323;

      vec2 offset =
        vec2(cos(angle), sin(angle)) *
        radius / uResolution;

      vec2 sampleUv = vUv + offset;

      float sampleDepth = depthAt(sampleUv);
      float sampleBlur = blurAt(sampleDepth);

      float weight;

      if (outer) {
        weight =
          step(sampleDepth, centerDepth - 0.05) *
          smoothstep(
            radius - 0.5,
            radius + 0.5,
            -sampleBlur
          );
      } else {
        weight = step(radius, abs(centerBlur));

        if (
          sampleDepth < centerDepth - 0.08 &&
          abs(sampleBlur) < radius
        ) {
          weight = 0.0;
        }
      }

      sum += texture2D(tDiffuse, sampleUv).rgb * weight;
      totalWeight += weight;
    }

    gl_FragColor = vec4(sum / totalWeight, 1.0);
  }
`;

export const volumeFragment = /* glsl */ `
  uniform sampler2D uDepth;

  uniform mat4 uInverseProjection;
  uniform mat4 uCameraWorld;
  uniform mat4 uInverseRoot;

  uniform vec3 uCameraPosition;
  uniform vec3 uAccent;

  uniform vec3 uLightPositions[6];
  uniform vec3 uLightColors[6];

  uniform float uNear;
  uniform float uFar;
  uniform float uTime;
  uniform float uDensity;

  varying vec2 vUv;

  float hash(vec3 p) {
    return fract(
      sin(dot(p, vec3(127.1, 311.7, 74.7))) *
      43758.5453123
    );
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);

    f = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(
        mix(hash(i), hash(i + vec3(1,0,0)), f.x),
        mix(
          hash(i + vec3(0,1,0)),
          hash(i + vec3(1,1,0)),
          f.x
        ),
        f.y
      ),
      mix(
        mix(
          hash(i + vec3(0,0,1)),
          hash(i + vec3(1,0,1)),
          f.x
        ),
        mix(
          hash(i + vec3(0,1,1)),
          hash(i + vec3(1,1,1)),
          f.x
        ),
        f.y
      ),
      f.z
    );
  }

  vec2 sphereIntersection(vec3 origin, vec3 direction, float radius) {
    float b = dot(origin, direction);
    float c = dot(origin, origin) - radius * radius;
    float discriminant = b * b - c;

    if (discriminant < 0.0) return vec2(-1.0);

    float root = sqrt(discriminant);
    return vec2(-b - root, -b + root);
  }

  float coreVisibility(vec3 p, vec3 lightPosition) {
    vec3 direction = lightPosition - p;
    float lightDistance = length(direction);

    direction /= max(lightDistance, 0.0001);

    float projection = dot(-p, direction);
    vec3 closest = p + direction * projection;

    bool occluded =
      projection > 0.0 &&
      projection < lightDistance &&
      dot(closest, closest) < 0.70;

    return occluded ? 0.12 : 1.0;
  }

  void main() {
    if (uDensity < 0.001) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }

    vec4 viewPoint = uInverseProjection *
      vec4(vUv * 2.0 - 1.0, 1.0, 1.0);

    vec3 viewDirection = normalize(viewPoint.xyz / viewPoint.w);

    vec3 worldDirection = normalize(
      mat3(uCameraWorld) * viewDirection
    );

    vec3 origin = (
      uInverseRoot * vec4(uCameraPosition, 1.0)
    ).xyz;

    vec3 direction = normalize(
      mat3(uInverseRoot) * worldDirection
    );

    vec2 intersection = sphereIntersection(
      origin,
      direction,
      5.5
    );

    if (intersection.y <= 0.0) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }

    float rawDepth = texture2D(uDepth, vUv).x;

    float viewDepth = (uNear * uFar) /
      (uFar - rawDepth * (uFar - uNear));

    float opaqueDistance =
      viewDepth / max(0.001, -viewDirection.z);

    float start = max(0.0, intersection.x);
    float end = min(intersection.y, opaqueDistance);

    if (end <= start) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }

    float stepSize = (end - start) / float(VOLUME_SAMPLES);

    float jitter = hash(vec3(
      gl_FragCoord.xy,
      floor(uTime * 12.0)
    ));

    float distance = start + stepSize * jitter;

    vec3 scattering = vec3(0.0);
    float transmittance = 1.0;

    for (int sampleIndex = 0; sampleIndex < VOLUME_SAMPLES; sampleIndex++) {
      vec3 p = origin + direction * distance;

      vec3 envelope = p / vec3(4.3, 3.1, 4.3);

      float density = exp(
        -dot(envelope, envelope) * 1.8
      );

      float cloud =
        noise(p * 0.65 + vec3(0.0, uTime * 0.025, 0.0)) * 0.72 +
        noise(p * 1.4 - uTime * 0.015) * 0.28;

      density *=
        0.047 *
        uDensity *
        (0.28 + cloud * 0.72);

      vec3 illumination = vec3(0.16, 0.18, 0.21);

      illumination += uAccent *
        0.8 / (0.8 + dot(p, p));

      for (int light = 0; light < 6; light++) {
        vec3 delta = uLightPositions[light] - p;
        float squaredDistance = dot(delta, delta);

        illumination +=
          uLightColors[light] *
          coreVisibility(p, uLightPositions[light]) /
          (0.12 + squaredDistance * 2.5);
      }

      float opacity = 1.0 - exp(-density * stepSize);

      scattering +=
        illumination *
        opacity *
        transmittance;

      transmittance *= 1.0 - opacity;

      distance += stepSize;
    }

    gl_FragColor = vec4(
      scattering,
      transmittance
    );
  }
`;

export const compositeFragment = /* glsl */ `
  uniform sampler2D tDiffuse;
  uniform sampler2D uParticles;
  uniform sampler2D uVolume;

  varying vec2 vUv;

  void main() {
    vec3 beauty = texture2D(tDiffuse, vUv).rgb;
    vec3 particles = texture2D(uParticles, vUv).rgb;
    vec4 volume = texture2D(uVolume, vUv);

    vec3 result =
      beauty * volume.a +
      volume.rgb +
      particles;

    gl_FragColor = vec4(result, 1.0);
  }
`;

export const grainFragment = /* glsl */ `
  uniform sampler2D tDiffuse;
  uniform float uTime;
  uniform float uGrain;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(
      sin(dot(p, vec2(12.9898, 78.233))) *
      43758.5453
    );
  }

  void main() {
    vec3 color = texture2D(tDiffuse, vUv).rgb;

    float grain = hash(
      gl_FragCoord.xy +
      floor(uTime * 24.0) * 19.17
    ) - 0.5;

    vec2 p = vUv * 2.0 - 1.0;

    float vignette = 1.0 -
      smoothstep(0.35, 1.55, length(p)) * 0.16;

    color *= vignette;
    color += grain * uGrain;

    gl_FragColor = vec4(
      clamp(color, 0.0, 1.0),
      1.0
    );
  }
`;