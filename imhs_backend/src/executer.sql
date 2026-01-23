SELECT * FROM Room r 
INNER JOIN Home h ON r.H_id = h.H_id
INNER JOIN User u  ON h.U_id = u.u_id
WHERE u.U_id = 1 AND r.r_id = 2 AND h.H_id = 1 ;


SELECT * FROM Home h join Room r ON r.H_id = h.H_id;


SELECT * FROM Room ;