interface UpdateSalesHeaderArgs {
  newDocumentStatus: 'Updated' | 'Updated Reversed';
  oldDocumentStatus: 'Saved' | 'Updated';
  salesHeaderId: string;
}

export { UpdateSalesHeaderArgs };