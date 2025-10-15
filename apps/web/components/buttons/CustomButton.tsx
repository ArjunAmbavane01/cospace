import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function CustomButton() {
    return (
        <div className="p-0.5 bg-foreground/10 group rounded-2xl">
            <div className='p-0.5 bg-gradient-to-t from-blue-500 to-blue-300 hover:bg-blue-400 border-2 border-blue-800 rounded-xl group-hover:bg-blue-400'>
                <Button
                    size={"lg"}
                    className='bg-gradient-to-b from-blue-600 via-blue-500 to-blue-600 text-white'>
                    <Plus fill='#fff' className='stroke-2' />
                            <h4>
                                Create Arena
                            </h4>
                </Button>
            </div>
        </div>
    )
}
