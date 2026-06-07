/**
 * ERC-8021: Transaction Attribution Standard (Draft/Simulation)
 * This is an implementation scaffold for assigning attribution to on-chain actions.
 */

export const ATTRIBUTION_CODE = "[ATTRIBUTION_CODE]";
export const BUILDER_CODE = "[BUILDER_CODE]";

export function generateAttributionPayload(action: string, metadata: any) {
  return {
    action,
    attributionCode: ATTRIBUTION_CODE,
    builderCode: BUILDER_CODE,
    metadata,
    timestamp: Date.now(),
  };
}

export function encodeAttributionData() {
  // Normally this would be ABI-encoded data appended to calldata or sent to an attribution relayer
  const hex = BUILDER_CODE.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
  return `0x8021${hex}`;
}
