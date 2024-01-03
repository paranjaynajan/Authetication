import { Component, ViewChild } from '@angular/core';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';


@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  standalone: true,
  imports: [AgGridModule], 
  styleUrls: ['./poll.component.css']
})
export class PollComponent {
getImage(value:string){
  
  return`<img src=${value} alt="image" />`
}

rowData=[
  {
    "SubcategoryId": " 3",
    "createdAt": "2023-12-15T12:19:45.129Z",
    "description": "High-performance Android smartphone",
    "id": "1",
    "name": "Samsung Galaxy S21",
    "price": "799.99",
    "status": "Available",
    "uniqueKey": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg==",
    "updatedAt": "2023-12-15T12:19:45.129Z",
    "userId": 55
  },
  {
    "SubcategoryId": " 3",
    "createdAt": "2023-12-15T12:19:45.129Z",
    "description": "High-performance Android smartphone",
    "id": "1",
    "name": "Samsung Galaxy S21",
    "price": "799.99",
    "status": "Available",
    "uniqueKey": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg==",
    "updatedAt": "2023-12-15T12:19:45.129Z",
    "userId": 45
  },
  {
    "SubcategoryId": " 3",
    "createdAt": "2023-12-15T12:19:45.129Z",
    "description": "High-performance Android smartphone",
    "id": "1",
    "name": "Samsung Galaxy S21",
    "price": "799.99",
    "status": "Available",
    "uniqueKey": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg=="
    ,
    "updatedAt": "2023-12-15T12:19:45.129Z",
    "userId": 55
  },
  {
    "SubcategoryId": " 3",
    "createdAt": "2023-12-15T12:19:45.129Z",
    "description": "High-performance Android smartphone",
    "id": "1",
    "name": "Samsung Galaxy S21",
    "price": "799.99",
    "status": "Available",
    "uniqueKey": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg==",
    "updatedAt": "2023-12-15T12:19:45.129Z",
    "userId": 45
  },
  {
    "SubcategoryId": " 3",
    "createdAt": "2023-12-15T12:19:45.129Z",
    "description": "High-performance Android smartphone",
    "id": "1",
    "name": "Samsung Galaxy S21",
    "price": "799.99",
    "status": "Available",
    "uniqueKey": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg==",
    "updatedAt": "2023-12-15T12:19:45.129Z",
    "userId": 23
  },
  {
    "SubcategoryId": " 3",
    "createdAt": "2023-12-15T12:19:45.129Z",
    "description": "High-performance Android smartphone",
    "id": "1",
    "name": "Samsung Galaxy S21",
    "price": "799.99",
    "status": "Available",
    "uniqueKey": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg==",
    "updatedAt": "2023-12-15T12:19:45.129Z",
    "userId": 22
  }
]
  colDefs: ColDef[] = [
    {
      headerName: "Id",
      field: "SubcategoryId",
      width: 150,
    },
    {
      headerName: "Product Name",
      field: "name",
      width: 150,
    },
    {
      headerName: "Description",
      field: "description",
      width: 150,
    },
    {
      headerName: "Price",
      field: "price",
      width: 150,
    },
    {
      headerName: "Status",
      field: "status",
      width: 150,
    },
    {
      headerName: "Publish Date",
      field: "createdAt",
      width: 150,
    },
    {
      headerName: "Purchase Date",
      field: "updatedAt",
      width: 150,
    },
    {
      headerName: "UserId",
      field: "userId",
      width: 150,
    },
    {
      headerName: "QR Code",
      field: "uniqueKey",
      width: 150,
      autoHeight:true,
      cellRenderer:(e:any)=>this.getImage(e.value)
    },
  ];
  defaultColDef:ColDef={
    sortable:true,
    filter:true
  }
  @ViewChild(AgGridAngular) agGrid!:AgGridAngular


  onCellClicked(e:any):void{
    console.log(e)
  }
  clearSelection(){
    this.agGrid.api.deselectAll()
  }
}
