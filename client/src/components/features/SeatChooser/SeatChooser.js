import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap';
import { io } from 'socket.io-client';
import { getSeats, loadSeats } from '../../../redux/seatsRedux';
import './SeatChooser.scss';

const SeatChooser = ({ chosenDay, chosenSeat, updateSeat }) => {
  const dispatch = useDispatch();
  const seats = useSelector(getSeats);

  useEffect(() => {
    const socket = io(
      process.env.NODE_ENV === 'production' ? '' : 'ws://localhost:8000',
      { transports: ['websocket'] },
    );
    socket.on('seatsUpdated', (seats) => {
      dispatch(loadSeats(seats));
    });

    return () => {
      socket.off('seatsUpdated');
      socket.disconnect();
    };
  }, [dispatch]);

  const isTaken = (seatId) => {
    return seats.some((item) => item.seat === seatId && item.day === chosenDay);
  };

  const prepareSeat = (seatId) => {
    if (seatId === chosenSeat)
      return (
        <Button key={seatId} className='seats__seat' color='primary'>
          {seatId}
        </Button>
      );
    else if (isTaken(seatId))
      return (
        <Button key={seatId} className='seats__seat' disabled color='secondary'>
          {seatId}
        </Button>
      );
    else
      return (
        <Button
          key={seatId}
          color='primary'
          className='seats__seat'
          outline
          onClick={(e) => updateSeat(e, seatId)}
        >
          {seatId}
        </Button>
      );
  };

  return (
    <div>
      <h3>Pick a seat</h3>
      <div className='mb-4'>
        <small id='pickHelp' className='form-text text-muted ms-2'>
          <Button color='secondary' /> – seat is already taken
        </small>
        <small id='pickHelpTwo' className='form-text text-muted ms-2'>
          <Button outline color='primary' /> – it's empty
        </small>
      </div>
      <div className='seats'>
        {[...Array(50)].map((x, i) => prepareSeat(i + 1))}
      </div>
    </div>
  );
};

export default SeatChooser;
