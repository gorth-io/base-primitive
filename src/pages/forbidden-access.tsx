import { Ban } from '@/cores/lucide'
import MiscellaneousLayout from '@/layouts/miscellaneous'

export default function ForbiddenAccessPage() {
  return (
    <MiscellaneousLayout
      name={403}
      icon={Ban}
      color="text-professional-danger"
      title="Forbidden Access!"
      description={[
        "You don't have necessary permission",
        "to view this resource."
      ]}
    />
  )
}