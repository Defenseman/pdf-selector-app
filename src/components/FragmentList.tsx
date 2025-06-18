import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { removeFragment } from "../store/slices/fragmentSlice";
import { v4 } from "uuid";

export const FragmentList = () => {
  const fragments = useSelector((state: RootState) => state.fragments.fragments)
  const dispatch = useDispatch();
  return (
    <ul style={{display: 'flex', flexDirection: 'column', listStyle: 'none', padding: '0'}}>
        {fragments.map((src) => (
            <li key={v4()} style={{display: 'flex', flexDirection: 'column'}}>
              <img
                key={v4()}
                src={src.base64}
                alt='Fragment'
                style={{ maxWidth: '100%'}} 
              />
              <button 
                style={{marginBottom: '10px', borderBottom: '1px solid white', width: '130px'}} 
                onClick={() => dispatch(removeFragment(src.id))}
              >Delete🗑️
              </button>
            </li>
        ))}
    </ul>
  )
}
