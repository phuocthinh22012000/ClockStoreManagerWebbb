import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import AdminProductTypeControl from '../../../components/AdminComponents/AdminProductTypeComponent/AdminProductTypeControl'
import AdminProductTypeFormAction from '../../../components/AdminComponents/AdminProductTypeComponent/AdminProductTypeFormAction'
import AdminProductTypeItem from '../../../components/AdminComponents/AdminProductTypeComponent/AdminProductTypeItem'
import AdminProductTypePaging from '../../../components/AdminComponents/AdminProductTypeComponent/AdminProductTypePaging'
import { ADD_LSP_ERROR, ADD_LSP_SUCCESS, DELETE_LSP_ERROR, DELETE_LSP_SUCCESS, UPDATE_LSP_ERROR, UPDATE_LSP_SUCCESS } from '../../../constants/Message'
import { actGetProductTypeAdmin, actAddProductTypeAdmin, actUpdateProductTypeAdmin, actResetMessageLSPAdmin, actDeleteProductType } from '../../../redux/actions/AdminProductTypeAction'

function ProductTypeAdmin() {

    // Load Reducer
    const productTypeReducer = useSelector(state => state.AdminProductTypeReducer);

    // State URL
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('name-asc');
    const [pageIndex, setPageIndex] = useState(1);

    //State Html
    const [elmListLSP, setElmListLSP] = useState(null);

    const [formValue, setFormValue] = useState({id : null, name : '', description : ''});
    const [actionValue, setActionValue] = useState('');

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const utf8_from_str = (s) => {
        var temp = decodeURIComponent(s);
        temp = temp.split("+");
        temp = temp.join(" ");
        return temp;
    }

    const str_from_utf8 = (s) => {
        var temp = s.split(" ");
        temp = temp.join("+");
        temp = encodeURIComponent(temp);
        return temp;
    }

    // Load State URL khi URL thay ?????i
    useEffect(() => {
        // console.log("location: ", location);
        var { search } = location;
        if(search === "") {
            setSort('name-asc');
            setPageIndex(1);
            setSearch('');
        } 
        else {
            var dauHoi = search.split('?');
            var dauVa = dauHoi[dauHoi.length-1].split('&');
            var dauBang;
            for(let i = 0; i < dauVa.length; ++i) {
                dauBang = dauVa[i].split('=');
                switch (dauBang[0]) {
                    case "sort":
                        setSort(dauBang[1]);
                        break;
                    case "pageIndex":
                        var value = parseInt(dauBang[1]);
                        if(value) {
                            setPageIndex(value);
                        }
                        else {
                            setPageIndex(1);
                        }
                        
                        break;
                    case "search":
                        setSearch(utf8_from_str(dauBang[1]));
                        break;
                    default:
                        break;
                }
            }
        }
    }, [location])

    // Load danh s??ch lo???i s???n ph???m
    useEffect(() => {
        // console.log("search: ", utf8_from_str(search));
        var data = {
            search : search,
            sort : sort,
            pageIndex : pageIndex
        }

        dispatch(actGetProductTypeAdmin(data));
    }, [sort, search, pageIndex, dispatch])

    // ti???n h??nh show danh s??ch lo???i s???n ph??m khi c?? d??? li???u
    useEffect(() => {
        // console.log("productTypeReducer: ", productTypeReducer);

        var result = null;
        if(productTypeReducer.dataValue.listLSP && productTypeReducer.dataValue.listLSP.length > 0) {
            result = productTypeReducer.dataValue.listLSP.map((productType, index) => {
                return <AdminProductTypeItem key={index} index={index} productType={productType} actionUpdate={actionUpdate} actionDelete={actionDelete}/>
            })
        }
        // dispatch(actResetMessageLSPAdmin());
        setElmListLSP(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productTypeReducer.dataValue])

    // Hi???n th??ng b??o khi th??m, s???a, x??a    
    useEffect(() => {
        switch (productTypeReducer.message) {
            case ADD_LSP_SUCCESS:
            case DELETE_LSP_SUCCESS:
            case UPDATE_LSP_SUCCESS:
                toast.success(productTypeReducer.message);
                var filter = {
                    search : search,
                    sort: sort,
                    pageIndex:pageIndex
                }
                dispatch(actGetProductTypeAdmin(filter));
                dispatch(actResetMessageLSPAdmin());
                break;
            case ADD_LSP_ERROR : 
            case DELETE_LSP_ERROR:
            case UPDATE_LSP_ERROR :
                toast.error(productTypeReducer.message); 
                dispatch(actResetMessageLSPAdmin());
                break;
            default:
                if(productTypeReducer.message) {
                    toast.error(productTypeReducer.message); 
                    dispatch(actResetMessageLSPAdmin());
                }
                break;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productTypeReducer.message])

    // ??i ?????n URL kh??c khi search
    const changeSearch = (searchValue) => {
        navigate('/admin/product-type?search=' + searchValue + '&sort=' + sort + '&pageIndex=' + 1);
    }

    // ??i ?????n URL kh??c khi sort
    const changeSort = (sortValue) => {
        navigate('/admin/product-type?search=' + search + '&sort=' + sortValue + '&pageIndex=' + pageIndex);
    }

    // nh???n button Th??m => Hi???n form
    const actionAdd = () => {
        // console.log("action Add");
        setFormValue({id : null, name : '', description : ''});
        setActionValue("add");
    }

    // Nh???n button S???a => hi???n form
    const actionUpdate = (data) => {
        // console.log(data);
        setFormValue(data);
        setActionValue("update");
    }

    // sau khi c?? gi?? tr??? c???a form th?? hi???n form
    const showForm = useCallback(
        () => {
            switch (actionValue) {
                case 'add':
                case 'update':
                    return <AdminProductTypeFormAction formValue={formValue} setActionValue={setActionValue} submitActionForm={submitActionForm}/>
            
                default:
                    return null;
            }
            
        },
        [actionValue, formValue],
    )
    
    // submit form th??m s???a lo???i s???n ph???m
    const submitActionForm = (data, action) => {
        // console.log(data);

        switch (action) {
            case 'add':
                dispatch(actAddProductTypeAdmin(data));
                setActionValue('');
                break;
            case 'update':
                dispatch(actUpdateProductTypeAdmin(data, data.id));
                setActionValue('');
                break;
            default:
                break;
        }
        
        console.log("message: ",productTypeReducer.message);
    }

    // Th???c hi???n thao t??c x??a
    const actionDelete = (id) => {
        var res = window.confirm("B???n c?? ch???c mu???n x??a lo???i s???n ph???m c?? Id = " + id + " kh??ng?");
        if(res) {
            dispatch(actDeleteProductType(id));
        }
        else {
            toast.error(DELETE_LSP_ERROR)
        }
    }

    return (
        <div>
            <div>
                <h3 className="text-center mt-2">Qu???n l?? lo???i s???n ph???m</h3>
                <hr />
            </div>
            
            <AdminProductTypeControl search={search} changeSearch={changeSearch} sort={sort} changeSort={changeSort} actionAdd={actionAdd}/>

            <div className="row mt-3">
                <table className="table table-hover ">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Id</th>
                            <th>T??n</th>
                            <th>M?? t???</th>
                            <th>H??nh ?????ng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {elmListLSP}
                    </tbody>
                </table>
            </div>
            
            <AdminProductTypePaging dataValue={productTypeReducer.dataValue}/>

            {/* <AdminProductTypeFormValue formValue={formValue} actionValue={actionValue}/> */}
            {showForm()}
        </div>
    )
}

export default ProductTypeAdmin
