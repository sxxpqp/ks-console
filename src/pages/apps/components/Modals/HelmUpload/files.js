export default [
  {
    name: 'Chart.yaml',
    description: 'CHART_FILE_DESC',
  },
  {
    name: 'LICENSE',
    description: 'LICENSE_FILE_DESC',
    isOptional: true,
  },
  {
    name: 'README.md',
    description: 'README_FILE_DESC',
    isOptional: true,
  },
  {
    name: 'requirements.yaml',
    description: 'REQUIREMENTS_FILE_DESC',
    isOptional: true,
  },
  { name: 'values.yaml', description: 'VALUES_FILE_DESC' },
  {
    name: 'charts/',
    description: 'CHARTS_FILE_DESC',
    isOptional: true,
    check: 'none',
  },
  {
    name: 'templates/',
    description: 'TEMPLATES_FILE_DESC',
    isOptional: true,
  },
  {
    name: 'templates/NOTES.txt',
    description: 'NOTES_FILE_DESC',
    isOptional: true,
  },
]
