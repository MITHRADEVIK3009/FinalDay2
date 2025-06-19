import { DocumentReviewPanel } from "@/components/officer/document-review-panel"

export default function DocumentReviewPage({ params }: { params: { id: string } }) {
  return <DocumentReviewPanel applicationId={params.id} />
}
