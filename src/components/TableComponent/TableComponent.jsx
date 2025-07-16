// import React, { useState } from "react";
// import { Table, Button } from "antd";
// import Loading from "../LoadingComponent/Loading";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// const TableComponent = (props) => {
//   const {
//     selectionType = "checkbox",
//     data = [],
//     isPending = false,
//     columns = [],
//     handleDeleteMany,
//   } = props;

//   const [rowSelectedKeys, setRowSelectedKeys] = useState([]);

//   const rowSelection = {
//     onChange: (selectedRowKeys) => {
//       setRowSelectedKeys(selectedRowKeys);
//     },
//   };

//   const handleDeleteAll = () => {
//     handleDeleteMany(rowSelectedKeys);
//   };

//   // ⚙️ Chuyển dữ liệu và xuất file .xlsx
//   const exportToExcel = () => {
//     // Loại bỏ các cột có render (custom JSX không xuất được)
//     const exportableColumns = columns.filter((col) => !col.render);

//     // Chuyển data sang định dạng plain object
//     const exportData = data.map((row) => {
//       const rowData = {};
//       exportableColumns.forEach((col) => {
//         rowData[col.title] = row[col.dataIndex];
//       });
//       return rowData;
//     });

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });

//     const blob = new Blob([excelBuffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });

//     saveAs(blob, "data-table.xlsx");
//   };

//   return (
//     <Loading isPending={isPending}>
//       {rowSelectedKeys.length > 0 && (
//         <div
//           style={{
//             background: "#1d1ddd",
//             color: "#fff",
//             fontWeight: "bold",
//             padding: "10px",
//             cursor: "pointer",
//           }}
//           onClick={handleDeleteAll}
//         >
//           Xóa tất cả
//         </div>
//       )}

//       <Button type="primary" onClick={exportToExcel} style={{ marginBottom: 10 }}>
//         Export Excel
//       </Button>

//       <Table
//         rowSelection={{
//           type: selectionType,
//           ...rowSelection,
//         }}
//         columns={columns}
//         dataSource={data}
//         {...props}
//       />
//     </Loading>
//   );
// };

// export default TableComponent;

import React, { useState } from "react";
import { Table, Button, Modal, Input, message } from "antd";
import Loading from "../LoadingComponent/Loading";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const TableComponent = (props) => {
  const {
    selectionType = "checkbox",
    data = [],
    isPending = false,
    columns = [],
    handleDeleteMany,
  } = props;

  const [rowSelectedKeys, setRowSelectedKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileName, setFileName] = useState("");

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setRowSelectedKeys(selectedRowKeys);
    },
  };

  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKeys);
  };

  const handleExportClick = () => {
    setFileName(""); // Reset tên file mỗi lần mở popup
    setIsModalVisible(true);
  };

  const handleExportConfirm = () => {
    if (!fileName.trim()) {
      message.warning("Vui lòng nhập tên file!");
      return;
    }

    const exportableColumns = columns.filter((col) => !col.render);

    const exportData = data.map((row) => {
      const rowData = {};
      exportableColumns.forEach((col) => {
        rowData[col.title] = row[col.dataIndex];
      });
      return rowData;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `${fileName.trim()}.xlsx`);
    setIsModalVisible(false);
  };

  return (
    <Loading isPending={isPending}>
      {rowSelectedKeys.length > 0 && (
        <div
          style={{
            background: "#1d1ddd",
            color: "#fff",
            fontWeight: "bold",
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </div>
      )}

      <Button type="primary" onClick={handleExportClick} style={{ marginBottom: 10 }}>
        Export Excel
      </Button>

      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        {...props}
      />

      <Modal
        title="Nhập tên file Excel"
        open={isModalVisible}
        onOk={handleExportConfirm}
        onCancel={() => setIsModalVisible(false)}
        okText="Xuất file"
        cancelText="Hủy"
      >
        <Input
          placeholder="Nhập tên file..."
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
      </Modal>
    </Loading>
  );
};

export default TableComponent;
