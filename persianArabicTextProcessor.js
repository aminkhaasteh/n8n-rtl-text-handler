// This function handles the shaping of Persian/Arabic text using presentation forms
function convertText(normal) {
  // Mapping of standard characters to their Isolated, Initial, Medial, and Final forms
  // [ Standard, Isolated, Initial, Medial, Final ]
  const charsMap = [
    [0x0621, 0xFE80, null, null, null],
    [0x0622, 0xFE81, null, null, 0xFE82],
    [0x0623, 0xFE83, null, null, 0xFE84],
    [0x0624, 0xFE85, null, null, 0xFE86],
    [0x0625, 0xFE87, null, null, 0xFE88],
    [0x0626, 0xFE89, 0xFE8B, 0xFE8C, 0xFE8A],
    [0x0627, 0xFE8D, null, null, 0xFE8E],
    [0x0628, 0xFE8F, 0xFE91, 0xFE92, 0xFE90],
    [0x0629, 0xFE93, null, null, 0xFE94],
    [0x062A, 0xFE95, 0xFE97, 0xFE98, 0xFE96],
    [0x062B, 0xFE99, 0xFE9B, 0xFE9C, 0xFE9A],
    [0x062C, 0xFE9D, 0xFE9F, 0xFEA0, 0xFE9E],
    [0x062D, 0xFEA1, 0xFEA3, 0xFEA4, 0xFEA2],
    [0x062E, 0xFEA5, 0xFEA7, 0xFEA8, 0xFEA6],
    [0x062F, 0xFEA9, null, null, 0xFEAA],
    [0x0630, 0xFEAB, null, null, 0xFEAC],
    [0x0631, 0xFEAD, null, null, 0xFEAE],
    [0x0632, 0xFEAF, null, null, 0xFEE0],
    [0x0633, 0xFEB1, 0xFEB3, 0xFEB4, 0xFEB2],
    [0x0634, 0xFEB5, 0xFEB7, 0xFEB8, 0xFEB6],
    [0x0635, 0xFEB9, 0xFEBB, 0xFEBC, 0xFEBA],
    [0x0636, 0xFEBD, 0xFEBF, 0xFEC0, 0xFEBE],
    [0x0637, 0xFEC1, 0xFEC3, 0xFEC4, 0xFEC2],
    [0x0638, 0xFEC5, 0xFEC7, 0xFEC8, 0xFEC6],
    [0x0639, 0xFEC9, 0xFECB, 0xFECC, 0xFECA],
    [0x063A, 0xFECD, 0xFECF, 0xFED0, 0xFECE],
    [0x0640, 0x0640, 0x0640, 0x0640, 0x0640],
    [0x0641, 0xFED1, 0xFED3, 0xFED4, 0xFED2],
    [0x0642, 0xFED5, 0xFED7, 0xFED8, 0xFED6],
    [0x0643, 0xFED9, 0xFEDB, 0xFEDC, 0xFEDA],
    [0x0644, 0xFEDD, 0xFEDF, 0xFEE0, 0xFEDE],
    [0x0645, 0xFEE1, 0xFEE3, 0xFEE4, 0xFEE2],
    [0x0646, 0xFEE5, 0xFEE7, 0xFEE8, 0xFEE6],
    [0x0647, 0xFEE9, 0xFEEB, 0xFEEC, 0xFEEA],
    [0x0648, 0xFEED, null, null, 0xFEEE],
    [0x0649, 0xFEEF, null, null, 0xFEF0],
    [0x064A, 0xFEF1, 0xFEF3, 0xFEF4, 0xFEF2],
    [0x067E, 0xFB56, 0xFB58, 0xFB59, 0xFB57], // Persian peh
    [0x06CC, 0xFBFC, 0xFBFE, 0xFBFF, 0xFBFD], // Persian yeh
    [0x0686, 0xFB7A, 0xFB7C, 0xFB7D, 0xFB7B], // Persian tcheh
    [0x06A9, 0xFB8E, 0xFB90, 0xFB91, 0xFB8F], // Persian keheh
    [0x06AF, 0xFB92, 0xFB94, 0xFB95, 0xFB93], // Persian gaf
    [0x0698, 0xFB8A, null, null, 0xFB8B], // Persian jeh
  ];

  // Ligatures (combinations like Lam + Alef)
  const combCharsMap = [
    [[0x0644, 0x0622], 0xFEF5, null, null, 0xFEF6],
    [[0x0644, 0x0623], 0xFEF7, null, null, 0xFEF8],
    [[0x0644, 0x0625], 0xFEF9, null, null, 0xFEFA],
    [[0x0644, 0x0627], 0xFEFB, null, null, 0xFEFC],
  ];

  // Transparent characters (diacritics etc. that don't affect shaping of neighbors)
  const transChars = [
    0x064B, 0x064C, 0x064D, 0x064E, 0x064F, 0x0650, 0x0651, 0x0652,
    0x0610, 0x0612, 0x0613, 0x0614, 0x0615, 0x0670, 0x06D6, 0x06D7,
    0x06D8, 0x06D9, 0x06DA, 0x06DB, 0x06DC, 0x06DF, 0x06E0, 0x06E1,
    0x06E2, 0x06E3, 0x06E4, 0x06E7, 0x06E8, 0x06EA, 0x06EB, 0x06EC, 0x06ED,
  ];

  const characterMapContains = c => charsMap.some(item => item[0] === c);
  const getCharRep = c => charsMap.find(item => item[0] === c);
  const getCombCharRep = (c1, c2) =>
    combCharsMap.find(item => item[0][0] === c1 && item[0][1] === c2);
  const isTransparent = c => transChars.includes(c);

  let shaped = '';

  for (let i = 0; i < normal.length; ++i) {
    let current = normal.charCodeAt(i);

    if (characterMapContains(current)) {
      let prev = null, next = null;
      let prevID = i - 1, nextID = i + 1;

      // Find the nearest non-transparent character before and after
      while (prevID >= 0 && isTransparent(normal.charCodeAt(prevID))) prevID--;
      while (nextID < normal.length && isTransparent(normal.charCodeAt(nextID))) nextID++;

      // Determine if previous/next characters exist and can participate in joining
      if (prevID >= 0) {
        let prevCharRep = getCharRep(normal.charCodeAt(prevID));
        if (prevCharRep && (prevCharRep[2] !== null || prevCharRep[3] !== null)) {
          prev = normal.charCodeAt(prevID);
        }
      }

      if (nextID < normal.length) {
        let nextCharRep = getCharRep(normal.charCodeAt(nextID));
        if (nextCharRep && (nextCharRep[3] !== null || nextCharRep[4] !== null)) {
          next = normal.charCodeAt(nextID);
        }
      }

      // Handle LAM + ALEF combinations (ligatures)
      if (current === 0x0644 && next &&
        [0x0622, 0x0623, 0x0625, 0x0627].includes(next)) {
        const comb = getCombCharRep(current, next);
        shaped += String.fromCharCode(prev ? comb[4] : comb[1]);
        i++; // Skip the next character
        continue;
      }

      const crep = getCharRep(current);

      // Apply shaping rules
      if (prev && next && crep[3]) {
        shaped += String.fromCharCode(crep[3]); // medial
      } else if (prev && crep[4]) {
        shaped += String.fromCharCode(crep[4]); // final
      } else if (next && crep[2]) {
        shaped += String.fromCharCode(crep[2]); // initial
      } else {
        shaped += String.fromCharCode(crep[1]); // isolated
      }
    } else {
      shaped += String.fromCharCode(current);
    }
  }

  return shaped;
}

// This function handles reversing text for RTL display with special handling for numbers and parentheses
function reverseWithSpecialHandling(text) {
  // Tokenize the text to identify segments that shouldn't be fully reversed (like numbers)
  const tokens = [];
  let currentToken = '';
  let inNumber = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = text.charCodeAt(i);

    // Check if character is a digit (standard or Arabic/Persian)
    const isDigit = (code >= 48 && code <= 57) || (code >= 0x0660 && code <= 0x0669) || (code >= 0x06F0 && code <= 0x06F9);

    if (isDigit) {
      if (!inNumber) {
        if (currentToken) {
          tokens.push({ type: 'text', value: currentToken });
          currentToken = '';
        }
        inNumber = true;
        currentToken = char;
      } else {
        currentToken += char;
      }
    } else {
      if (inNumber) {
        tokens.push({ type: 'number', value: currentToken });
        currentToken = '';
        inNumber = false;
      }

      // Handle parentheses specially
      if (char === '(') {
        if (currentToken) {
          tokens.push({ type: 'text', value: currentToken });
          currentToken = '';
        }
        tokens.push({ type: 'openParen', value: '(' });
      } else if (char === ')') {
        if (currentToken) {
          tokens.push({ type: 'text', value: currentToken });
          currentToken = '';
        }
        tokens.push({ type: 'closeParen', value: ')' });
      } else {
        currentToken += char;
      }
    }
  }

  if (currentToken) {
    tokens.push({ type: inNumber ? 'number' : 'text', value: currentToken });
  }

  // Reverse the order of the tokens
  tokens.reverse();

  // Build the reversed string by processing tokens
  let result = '';
  for (const token of tokens) {
    if (token.type === 'text') {
      // Reverse characters within text tokens
      result += token.value.split('').reverse().join('');
    } else if (token.type === 'number') {
      // Keep numbers as is
      result += token.value;
    } else if (token.type === 'openParen') {
      // Swap parentheses for RTL
      result += ')';
    } else if (token.type === 'closeParen') {
      // Swap parentheses for RTL
      result += '(';
    }
  }

  return result;
}

// Function to add line breaks to the *already reversed* text.
// It joins the parts in reverse order to ensure correct visual line flow (top-to-bottom).
function addLineBreaks(text, maxLength = 40) {
  if (text.length <= maxLength) return text;

  let breakIndex = -1;

  // Search backwards from maxLength for the first space
  for (let i = maxLength; i >= 0; i--) {
    if (text[i] === ' ') {
      breakIndex = i;
      break;
    }
  }

  // If no space found before or at maxLength, search forwards
  if (breakIndex === -1) {
      for (let i = maxLength + 1; i < text.length; i++) {
        if (text[i] === ' ') {
           breakIndex = i;
           break;
        }
      }
  }

  // If still no space found, return original text
  if (breakIndex === -1) {
      return text;
  }

  // Split the already reversed text
  const firstPart = text.substring(0, breakIndex);
  const secondPart = text.substring(breakIndex + 1);

  // Join in reverse order for correct RTL line flow
  return secondPart + '\n' + firstPart;
}


// Main execution block for n8n Code node
return items.map(item => {
  // --- CONFIGURATION ---
  // Change this variable to match the property name in your item.json
  // that contains the Persian/Arabic text you want to process.
  const inputPropertyName = 'title';
  // Change this variable to set the maximum desired line length before breaking.
  const maxLineLength = 40;
  // --- END CONFIGURATION ---

  if (item.json && item.json[inputPropertyName] && typeof item.json[inputPropertyName] === 'string') {
    const originalText = item.json[inputPropertyName];

    // 1. Shape the characters
    const shaped = convertText(originalText);

    // 2. Reverse the shaped text for RTL display, handling numbers/parentheses
    const reversedWithCorrections = reverseWithSpecialHandling(shaped);

    // 3. Add line breaks to the reversed text, ensuring correct line order
    const withLineBreaks = addLineBreaks(reversedWithCorrections, maxLineLength);

    return {
      json: {
        ...item.json,
        shapedText: withLineBreaks // Add the processed text
      }
    };
  } else {
     console.warn(`Item or item.json.${inputPropertyName} is missing or not a string:`, item);
     return item;
  }
});
