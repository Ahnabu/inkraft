# Blog Content Formatting Guide

This guide showcases all the available formatting features for blog posts on Inkraft.

## Typography

### Headings

Use headings to structure your content:

```markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

All headings automatically get:
- Anchor links for easy sharing
- Proper spacing and hierarchy
- Table of contents integration

### Text Formatting

**Bold text** for emphasis
*Italic text* for subtle emphasis
~~Strikethrough~~ for corrections
`Inline code` for technical terms
<mark>Highlighted text</mark> for important points

### Links

[Regular link](https://example.com)

External links automatically open in new tabs.

## Lists

### Unordered Lists

- First item
- Second item
  - Nested item
  - Another nested item
- Third item

### Ordered Lists

1. First step
2. Second step
3. Third step

### Task Lists

- [x] Completed task
- [ ] Pending task
- [ ] Another pending task

## Code Blocks

### Inline Code

Use `backticks` for inline code references.

### Code Blocks with Syntax

\`\`\`javascript
function greet(name) {
    console.log(`Hello, ${name}!`);
}

greet('World');
\`\`\`

\`\`\`python
def calculate_fibonacci(n):
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

print(calculate_fibonacci(10))
\`\`\`

\`\`\`typescript
interface User {
    id: string;
    name: string;
    email: string;
}

const user: User = {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com'
};
\`\`\`

Features:
- Syntax highlighting for 100+ languages
- Copy button for easy code sharing
- Line numbers (automatically added)
- Horizontal scrolling for long lines

## Quotes and Citations

### Blockquotes

> This is a blockquote. It's perfect for highlighting important quotes or citations.
> 
> Multiple paragraphs are supported.

### Citations

> "The best way to predict the future is to invent it."
> 
> <cite>— Alan Kay</cite>

## Callout Boxes

Use callout boxes to highlight important information:

:::info
This is an informational callout box. Use it for helpful tips and additional context.
:::

:::warning
This is a warning callout. Use it to alert readers about potential issues.
:::

:::success
This is a success callout. Use it for positive outcomes or achievements.
:::

:::error
This is an error callout. Use it to highlight mistakes or problems to avoid.
:::

## Tables

Create structured data with tables:

| Feature | Description | Status |
|---------|-------------|--------|
| Formatting | Rich text support | ✅ Active |
| Code Blocks | Syntax highlighting | ✅ Active |
| Images | Full support | ✅ Active |
| Tables | Responsive design | ✅ Active |

Tables are automatically:
- Responsive on mobile devices
- Styled with hover effects
- Properly bordered and spaced

## Images

### Basic Image

![Alt text describing the image](https://example.com/image.jpg)

### Image with Caption

![Beautiful landscape](https://example.com/landscape.jpg "A stunning mountain view at sunset")

Images automatically:
- Load lazily for performance
- Scale responsively
- Include shadows and rounded corners
- Support captions via title attribute

## Advanced Features

### Keyboard Keys

Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy and <kbd>Ctrl</kbd> + <kbd>V</kbd> to paste.

### Abbreviations

<abbr title="HyperText Markup Language">HTML</abbr> is the standard markup language.

### Subscript and Superscript

- H<sub>2</sub>O (water formula)
- E = mc<sup>2</sup> (Einstein's equation)

### Horizontal Rules

Use horizontal rules to separate sections:

---

## Special Text Elements

### Definition Lists

<dl>
  <dt>Term 1</dt>
  <dd>Definition of term 1</dd>
  
  <dt>Term 2</dt>
  <dd>Definition of term 2</dd>
</dl>

### Collapsible Sections

<details>
  <summary>Click to expand</summary>
  
  Hidden content goes here. Great for FAQ sections or additional details.
</details>

## Best Practices

### Writing Tips

1. **Use the drop cap effect** - Your first paragraph automatically gets a large first letter
2. **Structure with headings** - Use H2 and H3 for main sections and subsections
3. **Break up text** - Use lists, quotes, and images to maintain reader interest
4. **Add code examples** - Include syntax highlighting for technical content
5. **Use callouts wisely** - Highlight key takeaways or warnings

### Accessibility

- Always include alt text for images
- Use semantic headings in order (H2 → H3 → H4)
- Ensure link text is descriptive
- Use tables for tabular data only

### Performance

- Optimize images before uploading
- Use code blocks sparingly (they're heavy)
- Break long posts into sections with headings

## Styling Features

Your blog posts automatically include:

- **Drop cap** on first paragraph
- **Responsive typography** that scales beautifully
- **Dark mode support** for comfortable reading
- **Print-friendly** styles for PDF generation
- **Syntax highlighting** for code
- **Anchor links** on all headings
- **Copy buttons** on code blocks
- **Smooth scrolling** for navigation
- **External link indicators** for security

## Example Post Structure

```markdown
# Main Title (handled by post metadata)

Your engaging introduction paragraph starts here. The first letter will be large and bold.

## Problem Statement

Describe the problem you're solving...

### Background

Provide context...

## Solution

### Step 1: Planning

Details about planning...

\`\`\`javascript
// Code example
const plan = createPlan();
\`\`\`

### Step 2: Implementation

More details...

:::info
Pro tip: Always test your code before deploying!
:::

## Conclusion

Wrap up your post with key takeaways...

## Further Reading

- [Resource 1](#)
- [Resource 2](#)
```

## Technical Details

All content is:
- Sanitized for security (XSS prevention)
- Optimized for SEO
- Accessible (WCAG compliant)
- Mobile-responsive
- Fast-loading

---

Happy writing! 🎉
