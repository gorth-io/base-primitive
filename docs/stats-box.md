# StatsBox

Tám component dùng chung một `StatsBoxProps` trong `utils/interface.ts`:

| Component              | Mẫu                                                   |
| ---------------------- | ----------------------------------------------------- |
| `StatsBoxDefault`      | Default: icon phía trên, badge cạnh số                |
| `StatsBoxCrm`          | CRM: icon hành động góc phải, giá trị kỳ trước        |
| `StatsBoxFinance`      | Finance: số và mô tả căn phải, badge phía dưới        |
| `StatsBoxAnalytics`    | Analytics: số và badge hai phía, so sánh kỳ trước     |
| `StatsBoxProductivity` | Productivity: icon cùng tiêu đề, số hoặc nội dung chữ |
| `StatsBoxEcommerce`    | E-commerce: icon nhỏ bên phải, thay đổi dạng chữ      |
| `StatsBoxAcademy`      | Academy: icon thông tin, mô tả căn phải               |
| `StatsBox`             | Mẫu chuẩn hoá: tiêu đề/icon, số/thay đổi, mô tả       |

```tsx
import { StatsBox, StatsBoxCrm, StatsBoxFinance } from "@gorth/primitive/element/stats-box";
import { DollarSign } from "@gorth/primitive/cores/lucide";

<StatsBox
  title="Revenue"
  icon={DollarSign}
  number="$1,250.00"
  change="+12.5%"
  isActive={1}
  description="vs last month"
/>

<StatsBoxCrm
  title="Lead Pipeline Value"
  number="$284,500"
  previous="$254,200"
  description="last month"
  change="+12%"
  isActive={1}
  url="/pipeline"
/>
```

`StatsBoxProps` kế thừa `title`, `description`, `icon` bằng `Pick<NavSubItem, ...>`;
không thay đổi interface điều hướng và không bắt buộc truyền URL cho một ô chỉ đọc.

- `number`: `string | number`; caller định dạng tiền tệ, phần trăm hoặc nội dung như `Deep Work`.
- `isActive`: `1` tăng, `-1` giảm, `0` đi ngang. Đây là **hướng**, không phải trạng thái chọn.
- `change`: mức thay đổi độc lập với giá trị chính; `0` vẫn hiển thị. Chỉ có `isActive` thì hiển thị icon hướng, không tự sinh phần trăm. Không truyền cả hai thì ẩn thông tin thay đổi.
- `previous`: giá trị kỳ trước; `description` là kỳ hoặc ngữ cảnh so sánh. Analytics thêm `from` và dấu phân cách.
- `inverse`: tăng là xấu/giảm là tốt, ví dụ chi phí hoặc số yêu cầu trả hàng. Không đảo hướng mũi tên hay tự sửa dấu của `change`.
- `action`: UI hành động do app sở hữu, thay icon mặc định. Các mẫu CRM, Analytics, Productivity, Academy cũng hỗ trợ `url` cho icon liên kết. Không có URL/action thì icon chỉ trang trí, không tạo nút giả.
- `className`: chỉ áp dụng vào card gốc để ghép bố cục; không có props chỉnh class từng phần.

Các card ghép như Finance, Analytics, E-commerce dùng container tại app. Không đưa
biểu đồ Sales Overview hay dữ liệu kinh doanh của SSO vào Primitive:

```tsx
<div className="grid overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 md:grid-cols-2">
  {items.map((item) => (
    <StatsBoxFinance
      key={item.title}
      {...item}
      className="rounded-none ring-0 border-b border-border md:odd:border-r"
    />
  ))}
</div>
```

Nguồn 7 mẫu: các dashboard Default, CRM, Finance, Analytics, Productivity,
E-commerce và Academy của SSO. Hiện mới bổ sung vào nguồn Primitive; cần publish
và cài lại package trước khi chuyển các trang SSO sang những export mới này.
