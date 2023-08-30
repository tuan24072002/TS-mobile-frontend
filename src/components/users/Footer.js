import React from 'react'
import './Footer.scss';
import logo from '../../assets/logo/logo.png';
const Footer = () => {
    return (
        <>
            <div className='footer'>
                <div className='top'>
                    <a href='/'><img src={logo} alt='' /></a>
                </div>
                <div className='bottom'>
                    <div>
                        <h4>Branch</h4>
                        <p>Store 1: 187/7 Hoang Hoa Tham Street, Ward 6, Binh Thanh District, HCM City</p>
                        <p>Store 2: 164 Le Quoc Hung Street, Ward 13, District 4, HCM City</p>
                        <p>Store 3: 10/24 Nguyen Dinh Chieu Street, Da Kao Ward, Binh Thanh District, HCM City</p>
                        <p>Store 4: S5/6 Cu Xa Phu Lam A Street, Ward 12, District 6, HCM City</p>
                        <p>Store 5: 637/36/5 Tinh Lo 10 Street, Binh Tri Dong B Ward, Binh Tan District, HCM City</p>
                        <p>Hotline: 0587 928 264 (Mr.Tuan)</p>
                        <span className='social'>
                            <a href='/'><i class="fa-brands fa-facebook"></i></a>
                            <a href='/'><i class="fa-brands fa-instagram"></i></a>
                            <a href='/'><i class="fa-brands fa-youtube"></i></a>
                        </span>
                    </div>
                    <div>
                        <h4>MENU</h4>
                        <a href='/'>Home</a>
                        <a href='/'>Purchasing process</a>
                        <a href='/'>Return policy</a>
                    </div>
                    <div className='address'>
                        <h4>Address</h4>
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.3226620331147!2d106.69651287589858!3d10.786580659004585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f357792d95b%3A0xd460e67c2d74b0e!2zMjlhLzEwIE5ndXnhu4VuIMSQw6xuaCBDaGnhu4N1LCDEkGEgS2FvLCBRdeG6rW4gMSwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1687256552274!5m2!1svi!2s"
                            width="600"
                            height="450"
                            style={{ border: "0" }}
                            allowfullscreen=""
                            loading="lazy"
                            title="Google Map"
                        ></iframe>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footer