// Generated from examples/routing-cases.json.
export default [
  {
    "id": "R01",
    "input": "Where is the integration guide?",
    "reference": "docs",
    "candidate": "docs",
    "score": 0.99,
    "allowed": true
  },
  {
    "id": "R02",
    "input": "The service returns an error during setup.",
    "reference": "technical",
    "candidate": "technical",
    "score": 0.96,
    "allowed": true
  },
  {
    "id": "R03",
    "input": "Please explain the invoice line item.",
    "reference": "billing",
    "candidate": "billing",
    "score": 0.94,
    "allowed": true
  },
  {
    "id": "R04",
    "input": "I need the configuration reference.",
    "reference": "docs",
    "candidate": "docs",
    "score": 0.9,
    "allowed": true
  },
  {
    "id": "R05",
    "input": "An API request fails with the documented example.",
    "reference": "technical",
    "candidate": "technical",
    "score": 0.85,
    "allowed": true
  },
  {
    "id": "R06",
    "input": "An API charge on my invoice needs explanation.",
    "reference": "billing",
    "candidate": "technical",
    "score": 0.95,
    "allowed": true
  },
  {
    "id": "R07",
    "input": "The setup guide link is hard to find.",
    "reference": "docs",
    "candidate": "docs",
    "score": 0.79,
    "allowed": true
  },
  {
    "id": "R08",
    "input": "Can someone review this billing question?",
    "reference": "billing",
    "candidate": "billing",
    "score": 0.75,
    "allowed": true
  },
  {
    "id": "R09",
    "input": "This needs an unsupported category.",
    "reference": "technical",
    "candidate": "unrecognized",
    "score": 0.99,
    "allowed": true
  },
  {
    "id": "R10",
    "input": "A privileged request must go to a human owner.",
    "reference": "technical",
    "candidate": "technical",
    "score": 0.99,
    "allowed": false
  },
  {
    "id": "R11",
    "input": "The account view is unclear about an invoice.",
    "reference": "billing",
    "candidate": "docs",
    "score": 0.35,
    "allowed": true
  },
  {
    "id": "R12",
    "input": "How should I begin reading the documentation?",
    "reference": "docs",
    "candidate": "docs",
    "score": 0.6,
    "allowed": true
  }
];
