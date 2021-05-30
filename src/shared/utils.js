export function formatNumber (val) {
  return val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
}

/**
 * Format number to Rupiah currency format
 * @param  {Number, String} val
 * @param  {String} concat
 * @return {String}
 */
export function formatRupiah (val, concat = 'Rp ') {
  val = concat + formatNumber(val)
  return val
}