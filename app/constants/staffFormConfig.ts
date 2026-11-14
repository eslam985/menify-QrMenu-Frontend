export const staffFormConfig = () => {

  const tableColumns = [
    { key: "avatar_url", label: "الصورة" },
    { key: "username", label: "اسم الموظف" },
    { key: "email", label: "الايميل" },
    { key: "roles", label: "الدور / الصلاحية" },
    { key: "created_at", label: "تاريخ الانضمام" },
    { key: "updated_at", label: "آخر تعديل" },
    { key: "actions", label: "الإجراءات" },
  ];

  return { tableColumns };
};
