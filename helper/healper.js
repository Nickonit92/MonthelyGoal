module.exports = {
  /**
   * UPPERCASE first char of each word.
   */
  properCase: (str) => {
    return lowerCase(str).replace(/^\w|\s\w/g, upperCase);
  },

  /**
   * generate random string
   * @param length
   */
  generateRandomString: (length) => {
    const str =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const strLength = str.length;
    const res = [];
    for (let i = 0; i <= length; i++) {
      const randomChar = str[Math.floor(Math.random() * strLength)];
      res.push(randomChar);
    }
    return res.join("");
  },

  /**
   * get diffrence between 2 dates
   * @param date1
   * @param date2
   */
  yearsDiff: (d1, d2) => {
    let date1 = new Date(d1);
    let date2 = new Date(d2);
    let yearsDiff = date2.getFullYear() - date1.getFullYear();
    return yearsDiff;
  },

  userName: (name) => {
    const u1 = name.substring(0, 3);
    const u2 = name.substring(name.length - 3);
    const rendom = randomInt(4);
    return `${u1}${u2}${rendom}`;
  },
};
/**
 * "Safer" String.toLowerCase()
 */
(lowerCase = (str) => {
  return str.toLowerCase();
}),
  /**
   * "Safer" String.toUpperCase()
   */
  (upperCase = (str) => {
    return str.toUpperCase();
  }),
  /**
   * Generate random Int.
   */
  (randomInt = (min = 1000, max = 9999) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  });
