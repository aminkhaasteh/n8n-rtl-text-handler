# Persian/Arabic Text Processor for n8n Edit Image Node

This repository contains JavaScript code designed to correctly render Persian and Arabic text within the n8n `Edit Image` node. Standard text rendering in many environments, including potentially canvas-based rendering used by the `Edit Image` node, often struggles with the complexities of Right-to-Left (RTL) text, character shaping (connecting forms), and ligatures.

This code provides functions to address these issues, making it possible to overlay properly formatted Persian and Arabic text onto images in your n8n workflows.

## Features

* **Character Shaping:** Converts standard Unicode Persian/Arabic characters into their appropriate presentation forms (isolated, initial, medial, final) based on surrounding characters.
* **Ligature Handling:** Supports common ligatures like the various Lam-Alef combinations.
* **Right-to-Left (RTL) Reversal:** Reverses the order of characters and tokens to ensure correct RTL display within each line.
* **Smart Reversal:** Preserves the order of numbers and correctly swaps parentheses direction during the RTL reversal process.
* **Basic Line Breaking:** Adds simple line breaks based on a maximum length, finding a suitable space to split the text and ensuring lines appear in the correct top-to-bottom order for RTL reading.

## Why is this needed?

Languages like Persian and Arabic are written from Right-to-Left. Additionally, the shape of a character changes depending on its position within a word (e.g., standalone, at the beginning, middle, or end). Many characters also combine to form ligatures. Without proper processing, RTL text can appear jumbled, characters may not connect correctly, and ligatures might not form. This code performs the necessary transformations *before* sending the text to the image rendering engine.

## How to Use

This code is intended to be used in an n8n workflow, typically in a `Code` node placed before the `Edit Image` node.

1.  **Add a Code Node:** In your n8n workflow, add a `Code` node before your `Edit Image` node.
2.  **Insert the Code:** Copy the entire JavaScript code from `persianArabicTextProcessor.js` (or the block provided below) and paste it into the `Code` node's editor.
3.  **Configure Input:** The code is designed to process text from an item's JSON data. Locate the configuration section at the top of the `return items.map` block:
    ```javascript
    // --- CONFIGURATION ---
    // Change this variable to match the property name in your item.json
    // that contains the Persian/Arabic text you want to process.
    const inputPropertyName = 'title';
    // Change this variable to set the maximum desired line length before breaking.
    const maxLineLength = 40;
    // --- END CONFIGURATION ---
    ```
    Change the value of `inputPropertyName` to match the exact key in your incoming JSON data that holds the text you want to process (e.g., `'description'`, `'myPersianText'`).
    Adjust `maxLineLength` as needed based on the available width in your image and the font size you plan to use.
4.  **Configure Output:** The code adds the processed, ready-to-render text to the item under a new property called `shapedText`. You can change the name `shapedText` in the return object if you prefer a different property name.
    ```javascript
    return {
      json: {
        ...item.json,  // Preserve other properties
        shapedText: withLineBreaks // The processed text is added here
      }
    };
    ```
5.  **Use in Edit Image Node:** In your `Edit Image` node, when adding text, use the expression `{{ $json.shapedText }}` (or your chosen output property name) in the "Text" field.
6.  **Font:** Ensure the `Edit Image` node is configured to use a font that supports the required Arabic Unicode ranges, including the Arabic Presentation Forms A and B blocks (U+FE70–U+FEFF and U+FB50–U+FDFF). Without such a font, the shaped characters will likely appear as squares or incorrect glyphs.
