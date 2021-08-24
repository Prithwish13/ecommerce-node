var lengthOfLongestSubstring = function (s) {
  //   let max_len = 0;
  //   let curr = 0;
  //   let hash = {};
  //   if (s.length < 2) {
  //     return s.length;
  //   }
  //   for (let i = 0; i < s.length; i++) {
  //     if (hash[s[i]] == null) {
  //       curr += 1;
  //     } else {
  //       curr = Math.min(i - hash[s[i]], curr + 1);
  //     }
  //     max_len = Math.max(max_len, curr);
  //     hash[s[i]] = i; //save the index
  //   }
  //   return max_len;
  // };

  // console.log(lengthOfLongestSubstring("abcderacdhjd"));

  var maxLength = 0;
  var obj = {};
  var curr = 0;

  for (let i = 0; i < s.length; i++) {
    if (obj[s[i]] == undefined) {
      curr++;
    } else {
      curr = Math.min(i - obj[s[i]], curr + 1);
    }
    maxLength = Math.max(maxLength, curr);
    obj[s[i]] = i;
  }

  return maxLength;
};

lengthOfLongestSubstring("abbbabc");
