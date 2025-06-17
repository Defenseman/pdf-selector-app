type Props = {
    fragments: string[];
}

export const FragmentList = ({ fragments }: Props) => {
  return (
    <div>
        {fragments.length > 0 ? fragments.map((src, i) => (
            <img
                key={i} 
                src={src} 
                alt={`Фрагмент ${i + 1}`}
                style={{ maxWidth: '100%', marginBottom: '10px' }}
            />
        )) : <p>There is no fragments yet</p>
        }
    </div>
  )
}
