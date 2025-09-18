// New createDocumentSections function specifically for trust formatting

const createDocumentSections = async (template, formData) => {
  const children = []
  
  // For trust documents, don't add the main title here since it's handled in title_header section
  if (!template.title.includes('REVOCABLE LIVING TRUST')) {
    // Add title for non-trust documents
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: template.title.toUpperCase(),
            bold: true,
            size: 32,
          }),
        ],
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 400,
          after: 400,
        },
      })
    )
  }
  
  // Add sections with proper formatting
  for (let i = 0; i < template.sections.length; i++) {
    const section = template.sections[i]
    
    if (section.content && section.content.trim()) {
      // Handle trust document sections specifically
      if (template.title.includes('REVOCABLE LIVING TRUST')) {
        if (section.name === 'title_header') {
          // Trust title header - special formatting
          const lines = section.content.trim().split('\n')
          lines.forEach((line, index) => {
            if (line.trim()) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line.trim(),
                      bold: true,
                      size: index === 0 ? 32 : 28,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                  spacing: {
                    before: index === 0 ? 200 : 100,
                    after: index === lines.length - 1 ? 400 : 100,
                  },
                })
              )
            }
          })
        } else if (section.name && section.name.startsWith('article_')) {
          // Article sections - parse the content to separate header from body
          const lines = section.content.trim().split('\n').filter(line => line.trim())
          
          if (lines.length > 0) {
            // First line is the article header
            const articleHeader = lines[0]
            
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: articleHeader,
                    bold: true,
                    size: 28,
                    underline: {},
                  }),
                ],
                spacing: {
                  before: 400,
                  after: 200,
                },
              })
            )
            
            // Add blank line after header
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: '',
                    size: 12,
                  }),
                ],
                spacing: {
                  before: 0,
                  after: 100,
                },
              })
            )
            
            // Remaining lines are the content
            const contentLines = lines.slice(1)
            contentLines.forEach((line, index) => {
              if (line.trim()) {
                children.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: line.trim(),
                        size: 24,
                      }),
                    ],
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: {
                      before: 0,
                      after: line.trim() === '' ? 0 : 100,
                    },
                  })
                )
              }
            })
          }
        } else if (section.name === 'notary_acknowledgment') {
          // Notary section - bold header
          const lines = section.content.trim().split('\n')
          lines.forEach((line, index) => {
            if (line.trim()) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line.trim(),
                      bold: index === 0, // Make first line (header) bold
                      size: 24,
                    }),
                  ],
                  alignment: index === 0 ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
                  spacing: {
                    before: index === 0 ? 400 : 0,
                    after: 100,
                  },
                })
              )
            }
          })
        } else if (section.name === 'schedule_a') {
          // Schedule A - bold header
          const lines = section.content.trim().split('\n')
          lines.forEach((line, index) => {
            if (line.trim()) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line.trim(),
                      bold: index === 0, // Make first line (header) bold
                      size: 24,
                    }),
                  ],
                  alignment: index === 0 ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
                  spacing: {
                    before: index === 0 ? 400 : 0,
                    after: 100,
                  },
                })
              )
            }
          })
        } else {
          // Regular trust content sections
          const lines = section.content.trim().split('\n')
          lines.forEach((line, index) => {
            if (line.trim()) {
              const isSignatureLine = line.includes('Trustor') && line.includes(',') && !line.includes('Grantor:')
              
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line.trim(),
                      size: 24,
                      bold: line.includes('IN WITNESS WHEREOF') || isSignatureLine,
                    }),
                  ],
                  alignment: isSignatureLine ? AlignmentType.LEFT : AlignmentType.JUSTIFIED,
                  spacing: {
                    before: index === 0 ? 200 : 0,
                    after: line.includes('IN WITNESS WHEREOF') ? 200 : 100,
                  },
                })
              )
            }
          })
        }
      } else {
        // Handle other document types (will, poa, etc.) - simplified logic
        const lines = section.content.trim().split('\n')
        lines.forEach((line, index) => {
          if (line.trim()) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line.trim(),
                    size: 24,
                    bold: line.includes('ARTICLE') || line.includes('WITNESS'),
                  }),
                ],
                alignment: AlignmentType.JUSTIFIED,
                spacing: {
                  before: index === 0 ? 200 : 0,
                  after: index === lines.length - 1 ? 200 : 0,
                },
              })
            )
          }
        })
      }
    }
  }
  
  return [
    {
      properties: {
        page: {
          margin: {
            top: 1440,
            right: 1440,
            bottom: 1440,
            left: 1440,
          },
        },
      },
      children: children,
    },
  ]
}
