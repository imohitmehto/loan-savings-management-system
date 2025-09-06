// utils/parseFormDataBody.ts

/**
 * Utility: Converts flat FormData keys into nested body shape.
 * Handles addresses[] and nominees[] arrays with nested structures.
 */
export function parseFormDataBody(
  body: Record<string, any>,
): Record<string, any> {
  const result: Record<string, any> = {};
  const addresses: any[] = [];
  const nominees: any[] = [];

  Object.entries(body).forEach(([key, value]) => {
    if (key.startsWith("addresses[")) {
      // matches addresses[0].city or addresses[1].pinCode
      const match = key.match(/addresses\[(\d+)\]\.(.+)/);
      if (match) {
        const idx = parseInt(match[1], 10);
        const field = match[2];
        addresses[idx] = addresses[idx] || {};
        addresses[idx][field] = value;
      }
    } else if (key.startsWith("nominees[")) {
      // matches nominees[0].firstName or nominees[0].address.city
      const match = key.match(/nominees\[(\d+)\]\.(.+)/);
      if (match) {
        const idx = parseInt(match[1], 10);
        const path = match[2];
        nominees[idx] = nominees[idx] || {};
        if (path.startsWith("address.")) {
          const addrField = path.replace("address.", "");
          nominees[idx].address = nominees[idx].address || {};
          nominees[idx].address[addrField] = value;
        } else {
          nominees[idx][path] = value;
        }
      }
    } else {
      // direct field
      result[key] = value;
    }
  });

  if (addresses.length) {
    result.addresses = addresses;
  }
  if (nominees.length) {
    result.nominees = nominees;
  }

  return result;
}
