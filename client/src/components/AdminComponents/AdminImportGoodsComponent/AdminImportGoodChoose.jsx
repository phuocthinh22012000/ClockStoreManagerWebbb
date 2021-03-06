import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { actChooseProduct } from '../../../redux/actions/AdminImportGoodsAction';
import AdminImportGoodItem from './AdminImportGoodItem'

function AdminImportGoodChoose(props) {

    const {itemChoose, dataAction} = props;

    const [totalAmount, setTotalAmount] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [mail, setMail] = useState('');
    const [address, setAddress] = useState('');

    const [noteName, setNoteName] = useState('');
    const [notePhone, setNotePhone] = useState('');
    const [noteMail, setNoteMail] = useState('');
    const [noteAddress, setNoteAddress] = useState('');

    const [elmItems, setElmItems] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        if(itemChoose) {
            dispatch(actChooseProduct(itemChoose));
        }
    }, [dispatch, itemChoose])

    useEffect(() => {
        let result = null, amount = 0, price = 0;
        if(dataAction.listSP && dataAction.listSP.length > 0) {
            
            result = dataAction.listSP.map((item, index) => {
                amount += item.amount;
                price += item.price * item.amount;
                return <AdminImportGoodItem changeDataAction={props.changeDataAction} key={index} item={item} deleteItemAction={props.deleteItemAction}/>
            })
        }
        setElmItems(result);
        setTotalAmount(amount);
        setTotalPrice(price);
    }, [dataAction, props.changeDataAction, props.deleteItemAction])

    useEffect(() => {
        if(props.actionResetForm) {
            setAddress('');
            setPhone('');
            setMail('');
            setName('');
            props.setActionResetForm(false);
        }
    }, [props.actionResetForm])

    const submitLapPhieuNhap = () => {
        let temp = true;
        let format = /^[a-zA-Z][\w]{1,}/g;

        setNoteName('');
        setNotePhone('');
        setNoteMail('');
        setNoteAddress('');

        if(!name) {
            temp = false;
            setNoteName('H??? t??n l?? b???t bu???c!');
        }
        else {
            if(name.length < 4 || name.length > 100) {
                temp = false;
                setNoteName('H??? t??n t??? 4 ?????n 100 k?? t???!');
            }
        }

        if(!phone) {
            temp = false;
            setNotePhone('S??? ??i???n tho???i l?? b???t bu???c!');
        }
        else {
            if(phone.length !== 10) {
                temp = false;
                setNotePhone('S??? ??i???n tho???i ph???i c?? 10 k?? t???!');
            }
            else {
                format = /^(09|03|07|08|05)+([0-9]{8})/;
                if(!format.test(phone)) {
                    temp = false;
                    setNotePhone('S??? ??i???n tho???i b???t ?????u t??? 03, 05, 07, 08, 09 v?? l?? ch??? s???');
                }
            }
        }

        if(!mail) {
            temp = false;
            setNoteMail('Th?? ??i???n t??? l?? b???t bu???c!');
        }
        else {
            format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if(!format.test(mail)){
                setNoteMail("Th?? ??i???n t??? kh??ng h???p l???!");
                temp = false;
            }
        }

        if(!address) {
            temp = false;
            setNoteAddress('?????a ch??? l?? b???t bu???c!');
        } 

        if(!temp) {
            return;
        }

        let data = {
            user : props.user,
            phone,
            nameNCC : name,
            mail,
            address
        }
        props.submitCreatePhieuNhap(data);
    }

    const submitHuy = () => {
        setNoteName('');
        setNotePhone('');
        setNoteMail('');
        setNoteAddress('');

        props.submitBtnHuy();
    }

    return (
        <div>
            <div className="row mb-2 text-center" style={{ fontSize: '150%', fontWeight: 'bold' }}>
                Th??ng tin phi???u nh???p
            </div>
            <div className="row">
                <table className="table table-bordered table-hover">
                    <tbody>
                        <tr>
                            <td>Nh??n vi??n</td>
                            <td>
                                <input value={props.user} type="text" className="form-control" required="required" disabled/>
                            </td>
                        </tr>
                        <tr>
                            <td>T??n ng?????i cung c???p</td>
                            <td>
                                <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="form-control" required="required" />
                            </td>
                            <td className='note-validate'>{noteName}</td>
                        </tr>
                        <tr>
                            <td>S??? ??i???n tho???i ng?????i cung c???p</td>
                            <td>
                                <input value={phone} onChange={(e) => setPhone(e.target.value)} type="text" className="form-control" required="required" />
                            </td>
                            <td className='note-validate'>{notePhone}</td>
                        </tr>
                        <tr>
                            <td>Email ng?????i cung c???p</td>
                            <td>
                                <input value={mail} onChange={(e) => setMail(e.target.value)}  type="text" className="form-control" required="required" />
                            </td>
                            <td className='note-validate'>{noteMail}</td>
                        </tr>
                        <tr>
                            <td>?????a ch??? ng?????i cung c???p</td>
                            <td>
                                <input value={address} onChange={(e) => setAddress(e.target.value)} type="text" className="form-control" required="required" />
                            </td>
                            <td className='note-validate'>{noteAddress}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="row mb-2 text-center" style={{ fontSize: '150%', fontWeight: 'bold' }}>
                S???n ph???m ???? ch???n
            </div>
            <div className="row table-import-goods-action">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>T??n</th>
                            <th>H??nh ???nh</th>
                            <th>S??? l?????ng</th>
                            <th>Gi??</th>
                            <th>T???ng ti???n</th>
                            <th>H??nh ?????ng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {elmItems}
                        {/* <AdminImportGoodItem /> */}
                    </tbody>
                </table>

            </div>
            <div className="row mt-2">
                <div className="col-lg-4 offset-lg-4">
                    <div className="proceed-checkout">
                        <ul>
                            <li className="subtotal">T???ng s???n ph???m <span>{totalAmount}</span></li>
                            <li className="cart-total">Th??nh ti???n <span>{totalPrice.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</span></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="row d-flex justify-content-center mt-3 mb-3">
                
                <button onClick={submitLapPhieuNhap} type="button" className="btn btn-primary">L???p phi???u nh???p</button>
                <button onClick={submitHuy} type="button" className="btn btn-danger ml-3">H???y</button>
                
            </div>
        </div>
    )
}

export default AdminImportGoodChoose
