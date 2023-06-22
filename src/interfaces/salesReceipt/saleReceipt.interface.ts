interface UpdateSalesHeaderArgs {
  newDocumentStatus: 'Updated' | 'Updated Reversed';
  oldDocumentStatus: 'Saved' | 'Updated';
  salesHeaderId: string;
  reversalId?: string;
}

export { UpdateSalesHeaderArgs };
