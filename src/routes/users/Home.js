import React, { useState } from 'react';
import '../../styles/users/Home.scss'
import image1 from '../../assets/images/hero_deep_purple__dlhl8s8j6wk2_large.jpg';
import image2 from '../../assets/images/hero_gold__eys85yr14k2u_large.jpg';
import image3 from '../../assets/images/hero_silver__8is8ix39ybm2_medium.jpg';
import image4 from '../../assets/images/hero_space_black__d2ll5e0lazcm_large.jpg';
import grid1 from '../../assets/images/dynamic_island_deep_purple__exowosw6732a_large_2x.jpg';
import grid2 from '../../assets/images/camera_deep_purple__fviv8fv1dyqa_large_2x.jpg';
import grid3 from '../../assets/images/chip_deep_purple__bs3dtgitlt6q_large_2x.jpg';
import grid4 from '../../assets/images/cinematic_mode_startframe__f08xxehg9dea_large.jpg';
import videogrid5 from '../../assets/images/large.mp4';
import grid6 from '../../assets/images/always_on_deep_purple__bt30qm606e4i_large.jpg';
import card1 from '../../assets/images/compare_iphone_14_pro__dny32075a7ki_large_2x.jpg';
import colorcard1 from '../../assets/images/swatch_iphone_14_pro__jfy7hdoqs7qm_large_2x.png';
import namecard1 from '../../assets/images/logo_iphone_14_pro__dhsakcp2gze6_large_2x.png';
import card2 from '../../assets/images/compare_iphone_14__eqqs4h5c53gy_large_2x.jpg';
import colorcard2 from '../../assets/images/swatch_iphone_14__f4faxicoleaa_large_2x.png';
import namecard2 from '../../assets/images/logo_iphone_14__ejszbad7vyy6_large_2x.png';
import card3 from '../../assets/images/compare_iphone_13__jxgor7g19iai_large_2x.jpg';
import colorcard3 from '../../assets/images/swatch_iphone_13__bzsdg69jltqq_large_2x.png';
import namecard3 from '../../assets/images/logo_iphone_13__dx5e6b1ergom_large_2x.png';
const Home = () => {
    const [selectedOption, setSelectedOption] = useState('option1');

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };
    const imagePaths = {
        option1: image1,
        option2: image2,
        option3: image3,
        option4: image4,
    };
    const selectedImagePath = imagePaths[selectedOption];
    return (
        <>
            <div className='all-home'>
                <div className='color-poster'>
                    <div className='top-home'>
                        <div className='select-color'>
                            <div className='title'><b>Color</b></div>
                            <div className='radio-button'>
                                <input className='custom-radio1'
                                    style={{ backgroundColor: '#333' }}
                                    type="radio"
                                    name="colorOption"
                                    value="option1"
                                    checked={selectedOption === 'option1'}
                                    onChange={handleOptionChange}
                                />

                                <input className='custom-radio2'
                                    type="radio"
                                    name="colorOption"
                                    value="option2"
                                    checked={selectedOption === 'option2'}
                                    onChange={handleOptionChange}
                                />
                                <input className='custom-radio3'
                                    type="radio"
                                    name="colorOption"
                                    value="option3"
                                    checked={selectedOption === 'option3'}
                                    onChange={handleOptionChange}
                                />
                                <input className='custom-radio4'
                                    type="radio"
                                    name="colorOption"
                                    value="option4"
                                    checked={selectedOption === 'option4'}
                                    onChange={handleOptionChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='center-home'>
                        <div className="image-placeholder">
                            {selectedOption === 'option1' && (
                                <a href="product/15/4/1/3/4">
                                    <img src={selectedImagePath} alt="" />
                                </a>
                            )}
                            {selectedOption === 'option2' && (
                                <a href="/product/13/4/1/1/4">
                                    <img src={selectedImagePath} alt="" />
                                </a>
                            )}
                            {selectedOption === 'option3' && (
                                <a href="/product/16/4/1/4/4">
                                    <img src={selectedImagePath} alt="" />
                                </a>
                            )}
                            {selectedOption === 'option4' && (
                                <a href="/product/14/4/1/2/4">
                                    <img src={selectedImagePath} alt="" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
                <div className='content-home' style={{ backgroundColor: '#161617' }}>
                    <div className='top'>
                        <h2 style={{ color: 'white' }}>iPhone 14 Pro and iPhone 14 Pro Max</h2>
                        <p style={{ color: '#86868b' }}>From $999 or $41.62/mo. for 24 mo. before trade‑in*</p>
                        <a className='btn btn-primary' href='/product'>Buy</a>
                    </div>
                    <div class="grid-container1">
                        <div class="item">
                            <h3>Meet<br />
                                Dynamic Island.</h3>
                            <img src={grid1} alt='' width={'425px'} height={'483px'} />
                            <a href='/product'><i class="fa-sharp fa-solid fa-circle-right fa-beat"></i></a>
                        </div>
                        <div class="item">
                            <div className='image-grid2'>
                                <img src={grid2} alt='' width={'371px'} height={'370px'} />
                            </div>
                            <h4>48MP Main camera.<br /> Mind-blowing detail.</h4>
                            <a href='/product'><i class="fa-sharp fa-solid fa-circle-right fa-beat"></i></a>
                        </div>
                        <div class="item"><img src={grid3} alt='' width={'371px'} height={'320px'} />
                            <h3>The<br /> mastermind<br /> behind it all.</h3>
                            <div className='image-grid3'>
                                <a href='/product'><i class="fa-sharp fa-solid fa-circle-right fa-beat"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="grid-container2">
                        <div className='item'>
                            <div className='item1'>
                                <h4>A battery that’s</h4><br />
                                <b>
                                    <h2 className='all-in'>all in,</h2>
                                    <h2 className='all-day'>all day.</h2>
                                </b>
                                <a href='/product'><i class="fa-sharp fa-solid fa-circle-right fa-beat"></i></a>
                            </div>
                            <div className='item2'>
                                <div className='image-grid4'>
                                    <img src={grid4} alt='' />
                                </div>
                                <div className='icon-item2'>
                                    <a href='/product'><i class="fa-sharp fa-solid fa-circle-right fa-beat"></i></a>
                                </div>

                            </div>
                            <div className='item3'>
                                <video loop>
                                    <source src={videogrid5} type="video/mp4" />
                                </video>
                                <div className='title'>
                                    <h4>Action mode</h4>
                                    <h3>
                                        Shaky shots,<br />
                                        stable video.
                                    </h3>
                                </div>
                                <a href='/product'><i class="fa-sharp fa-solid fa-circle-right fa-beat"></i></a>
                            </div>
                            <div className='item4'>
                                <div className='image-grid6'>
                                    <img src={grid6} alt='' />
                                </div>
                                <div className='title'>
                                    <h3>
                                        Always-On display. <br />
                                        A subtle way to stay <br />
                                        in the know.
                                    </h3>
                                </div>
                                <a href='/product'><i class="fa-sharp fa-solid fa-circle-right fa-beat"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className='right-for-you'>
                        <div className='top'>
                            <h1>Which iPhone is right <br /> for you?</h1>
                            <a href='/product'>Compare all iPhone models</a>
                        </div>
                        <div className='card-right-for-you'>
                            <div className='card'>
                                <div className='img'>
                                    <img src={card1} alt='' />
                                </div>
                                <div className='color'>
                                    <img src={colorcard1} alt='' />
                                </div>
                                <div className='new'>
                                    <p>New</p>
                                </div>
                                <div className='name'>
                                    <img src={namecard1} alt='' />
                                </div>
                                <div className='feature'>
                                    <p>The ultimate iPhone.</p>
                                </div>
                                <div className='price'>
                                    <p>From 24.750.000đ</p>
                                </div>
                                <a href='/' className='btn btn-primary'>Buy</a>
                                <div className='learn-more'>
                                    <a href='/'>Learn more</a>
                                </div>
                            </div>
                            <div className='card'>
                                <div className='img'>
                                    <img src={card2} alt='' />
                                </div>
                                <div className='color'>
                                    <img src={colorcard2} alt='' />
                                </div>
                                <div className='new'>
                                    <p>New</p>
                                </div>
                                <div className='name'>
                                    <img src={namecard2} alt='' />
                                </div>
                                <div className='feature'>
                                    <p>A total powerhouse.</p>
                                </div>
                                <div className='price'>
                                    <p>From 19.190.000đ</p>
                                </div>
                                <a href='/' className='btn btn-primary'>Buy</a>
                                <div className='learn-more'>
                                    <a href='/'>Learn more</a>
                                </div>
                            </div>
                            <div className='card'>
                                <div className='img'>
                                    <img src={card3} alt='' />
                                </div>
                                <div className='color'>
                                    <img src={colorcard3} alt='' />
                                </div>
                                <div className='new'>
                                    <p>New</p>
                                </div>
                                <div className='name'>
                                    <img src={namecard3} alt='' />
                                </div>
                                <div className='feature'>
                                    <p>As amazing as ever.</p>
                                </div>
                                <div className='price'>
                                    <p>From 16.690.000đ</p>
                                </div>
                                <a href='/' className='btn btn-primary'>Buy</a>
                                <div className='learn-more'>
                                    <a href='/'>Learn more</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};

export default Home;