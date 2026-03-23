import "./NotFound.style.scss";

const NotFound = () => {
  return (
    <div className='notfound'>
      <img src='./gif/NotFound.gif' alt='Not Found' className='notfound__image' />
      <div className='notfound__text'>Page Not Found</div>
    </div>
  );
};

export default NotFound;
